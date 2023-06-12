import { ButtonInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, StageChannel, User, VoiceChannel, ButtonStyle, CommandInteraction, TextChannel, Message, Embed, Interaction, InteractionCollector } from "discord.js";
import Track, { TrackPlatform } from "./Track";
import { BotEmbed, ErrorEmbed, TrackEmbed } from "../ExtendedEmbeds";
import { AudioPlayer, AudioPlayerError, AudioPlayerState, AudioPlayerStatus, AudioResource, getVoiceConnection } from "@discordjs/voice";
import MusicManager from "./MusicManager";
import Playlist from "./Playlist";
import { getRow, getRowDisabled } from "../../utils/Utils";

export default class Queue
{
	public readonly guildId: string;
	public musicManager: MusicManager;

	public interaction: CommandInteraction;
	public voiceChannel: VoiceChannel | StageChannel;
	public textChannel: TextChannel;

	public audioPlayer: AudioPlayer;
	public audioResource: AudioResource | null = null;
	public volume: number = 1;
	public paused = false;
	public loopMode: QueueLoopMode = QueueLoopMode.None;
	public skipped = false;

	public tracks: Track[] = [];
	public currentTrack = 0;
	public previousTrack = 0;

	// Queue Embeds
	public queueEmbeds: EmbedBuilder[] = [];
	public queuePage = 0;
	private queueReply: Message | null = null;
	private queueCollector: InteractionCollector<any> | null = null;
	

	public constructor(musicManager: MusicManager, interaction: CommandInteraction, voiceChannel: VoiceChannel | StageChannel, textChannel: TextChannel, audioPlayer: AudioPlayer)
	{
		this.musicManager = musicManager;
		this.guildId = interaction.guildId!;

		this.interaction = interaction;
		this.voiceChannel = voiceChannel;
		this.textChannel = textChannel;

		this.audioPlayer = audioPlayer;

		// Play next track once audio player stops playing
		this.audioPlayer.on(AudioPlayerStatus.Idle, (oldState: AudioPlayerState) => {
			if (oldState.status != AudioPlayerStatus.Playing) return;

			this.nextTrack();
		});

		this.audioPlayer.on("error", (err: AudioPlayerError) => console.log(err));
	}

	public async addTrack(toAdd: Track | Playlist, replyTo: CommandInteraction)
	{
		if (toAdd instanceof Track)
		{
			this.tracks.push(toAdd);

			if (this.tracks.length == 1) return;

			const embed =  new TrackEmbed("Added Track", toAdd.platform)
				.addFields([
					{
						name: "Track",
						value: toAdd.formattedTitle,
					},
					{
						name: "Track Length",
						value: toAdd.duration,
						inline: true
					},
					{
						name: "Position in Queue",
						value: `${this.tracks.length}`,
						inline: true
					}
				])
				.setThumbnail(toAdd.thumbnail)
				.setFooter({ text: `Requested by ${toAdd.addedBy.tag}`});

			await replyTo.followUp({ embeds: [embed] });
			return;
		}

		for (let i = 0; i < toAdd.tracks.length; i++) {
			const track = toAdd.tracks[i];
			this.tracks.push(track);
		}

		const embed = new TrackEmbed("Added Playlist", toAdd.platform)
			.addFields([
				{
					name: "Playlist",
					value: `[${toAdd.title}](${toAdd.url})`,
				},
				{
					name: "Playlist Length",
					value: toAdd.duration,
					inline: true
				},
				{
					name: "Tracks",
					value: toAdd.tracks.length.toString(),
					inline: true
				}
			])
			.setThumbnail(toAdd.thumbnail)
			.setFooter({ text: `Requested by ${toAdd.requestedBy.tag}`});

		await replyTo.followUp({ embeds: [embed] });
	}

	public getCurrentTrack(): Track
	{
		return this.tracks[this.currentTrack];
	}

	// Playback
	public async playTrack(track: Track)
	{
		this.audioResource = await track.createResource();
		this.audioResource.volume?.setVolume(this.volume);
		this.audioPlayer.play(this.audioResource);

		const embed = new TrackEmbed(`Now Playing ${track.formattedTitle}`, track.platform);

		if ((await this.interaction.fetchReply()).embeds.length == 0)
			this.interaction.followUp({ embeds: [embed] });
		else
			this.textChannel.send({ embeds: [embed] });
	}

	public async nextTrack()
	{
		this.tracks[this.previousTrack].clearLyricsEmbeds();
		if(this.loopMode == QueueLoopMode.Track && !this.skipped)
		{
			this.playTrack(this.tracks[this.currentTrack]);
			return;
		}

		if (this.tracks[this.currentTrack + 1] != undefined) {
			this.playTrack(this.tracks[this.currentTrack + 1]!,);

			this.currentTrack++;
		}
		else if (this.loopMode == QueueLoopMode.Queue) {
			this.playTrack(this.tracks[0]);
			this.currentTrack = 0;
		}
		else this.destroy();

		if (this.skipped) this.skipped = false;

		this.previousTrack = this.currentTrack;
	}

	public async jumpTrack(position: number, replyTo: CommandInteraction)
	{
		await replyTo.deferReply();

		if (!this.tracks[position])
		{
			const embed = new ErrorEmbed(`There is no track at position \`${position + 1}\``);
			replyTo.followUp({ embeds: [embed], ephemeral: true});
			return;
		}

		const track = this.tracks[position];

		if (this.currentTrack == position)
		{
			const embed = new TrackEmbed(`[${track.shortTitle}](${track.url}) is already playing`, track.platform);
			replyTo.followUp({ embeds: [embed], ephemeral: true});
			return;
		}

		this.interaction = replyTo;
		this.currentTrack = position - 1;
		this.skipped = true;
		this.audioPlayer.stop();
	}

	public setVolume(volume: number)
	{
		this.volume = volume;
		this.audioResource?.volume?.setVolume(volume);
	}

	// Queue command
	public async generateQueueEmbed(interaction: CommandInteraction): Promise<void>
	{
		await interaction.deferReply();
		let k = 10;

		if (this.queueReply) this.clearQueuePages();

		for (let i = 0; i < this.tracks.length; i += 10)
		{
			const current = this.tracks.slice(i, k);
			let j = i
			k += 10;

			const info = current.map(track => { 
				let emoji: string = ""

				switch (track.platform)
				{
					case TrackPlatform.Discord:
						emoji = "<:discord:1115914182014017546>";
						break;
					case TrackPlatform.YouTube:
						emoji = "<:youtube:1115914187047178300>";
						break;
					case TrackPlatform.Newgrounds:
						emoji = "<:newgorunds:1115914183872098324>";
						break;
					case TrackPlatform.Spotify:
						emoji = "<:spotify:1116325974099886081>";
						break;
				}
				return `${++j} - \`[${track.duration}]\` ${emoji} ${track.shortTitle}`
			}).join("\n");

			this.queueEmbeds.push(new BotEmbed().setDescription(`**${interaction.guild?.name}'s Queue**\n------------------------------\n${info}\n------------------------------\n**Page ${(i+10)/10}/${Math.ceil(this.tracks.length / 10)}**`));
		}

		this.queueReply = await interaction.followUp({ embeds: [this.queueEmbeds[0]], components: [getRow(this.queuePage, this.queueEmbeds.length, "queue")] });
		this.queueCollector = this.queueReply.createMessageComponentCollector();

		this.queueCollector.on('collect', (buttonInt: ButtonInteraction) => {
			switch (buttonInt.customId)
			{
				case "queue-FirstPage":
					this.queuePage = 0;
					break;
				case "queue-PrevPage":
					--this.queuePage
					break;
				case "queue-NextPage":
					++this.queuePage
					break;
				case "queue-LastPage":
					this.queuePage = this.queueEmbeds.length - 1;
					break;
			}

			buttonInt.update({ embeds: [this.queueEmbeds[this.queuePage]], components: [getRow(this.queuePage, this.queueEmbeds.length, "queue")] });
		});
	}

	public clearQueuePages()
	{
		if (!this.queueCollector) return;
		this.queueReply?.delete();
		this.queueCollector!.removeAllListeners();
		
		this.queueEmbeds = [];
		this.queuePage = 0;
		this.queueReply = null;
		this.queueCollector = null;
	}

	public destroy(): void
	{
		this.clearQueuePages();

		for (let i = 0; i < this.tracks.length; i++)
		{
			const track = this.tracks[i];
			track.clearLyricsEmbeds();
		}

		getVoiceConnection(this.guildId)?.destroy();
		this.audioPlayer.removeAllListeners();
		this.musicManager.queues.delete(this.guildId);
	}
}

export enum QueueLoopMode {
	None,
	Track,
	Queue
}