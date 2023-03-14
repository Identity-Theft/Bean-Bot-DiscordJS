import { AudioPlayerError, AudioPlayerState, AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, entersState, joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandAttachmentOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, TextChannel } from "discord.js";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import Queue from "../../structures/music/Queue";
import Song from "../../structures/music/Song";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";

export default class PlayCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandGroupBuilder()
		.setName("play")
		.setDescription("Add a song to the queue.")
		.addSubcommand(new SlashCommandSubcommandBuilder()
			.setName("file")
			.setDescription("Upload a audio or video file to add to the queue.")
			.addAttachmentOption(new SlashCommandAttachmentOption()
				.setName("song")
				.setDescription("Video or Audio file.")
				.setRequired(true)
			)
		)
		.addSubcommand(new SlashCommandSubcommandBuilder()
			.setName("name-url")
			.setDescription("Name or url of the song to add to the queue.")
			.addStringOption(new SlashCommandStringOption()
				.setName("song")
				.setDescription("Name or url.")
				.setRequired(true)
			)
		)

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {

		const guildId = interaction.guildId!;
		const member = await interaction.guild?.members.fetch(interaction.user.id);
		const channel = member!.voice.channel!;

		await interaction.deferReply();

		// Create song
		const subcommand = args.getSubcommand();

		try {
			const songs = await client.musicManager.songInfo(subcommand == "name-url" ? args.getString("song")! : args.getAttachment("song")!, interaction.user);
			let queue = client.musicManager.queues.get(interaction.guildId!);

			// Create queue if one doesn't exist
			if (!queue)
			{
				const guild = await client.guilds.fetch(guildId);
				const textChannel = await guild.channels.fetch(interaction.channelId!);

				const connection = joinVoiceChannel({ channelId: channel.id, guildId: guildId, adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator });
				const newQueue = new Queue(channel, textChannel as TextChannel, interaction.user);
				queue = newQueue;

				client.musicManager.connections.set(guildId, connection);
				client.musicManager.queues.set(guildId, newQueue);

				connection.on(VoiceConnectionStatus.Ready, async () => {
					this.playSong(client, guildId, connection, newQueue, songs[0]!, interaction);
				});

				connection.on(VoiceConnectionStatus.Disconnected, async () => {
					try
					{
						await Promise.race([
							entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
							entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
						]);
					}
					catch (error)
					{
						client.musicManager.disconnect(guildId);
					}
				});
			}

			const addedToQueue: Array<Song> = [];

			for (let i = 0; i < songs.length; i++) {
				const song = songs[i];
				let inQueue = false

				queue.songs.every(s => {
					if (song.url == s.url)
						inQueue = true;

					return !inQueue;
				});

				if (!inQueue && queue.songs.length! < queue.maxSongs)
				{
					addedToQueue.push(song);
					client.musicManager.addSong(guildId, song);

					if (queue.songs.length == 1 && songs.length == 1) return;
				}

				if (inQueue)
				{
					const embed = new ErrorEmbed("This song is already in the queue");
					interaction.followUp({ embeds: [embed] });
					return;
				}
			}

			if (addedToQueue.length > 0)
			{
				let title = "";
				let description = "";
				let thumbnail: string | null = "";

				if (addedToQueue.length == 1)
				{
					const song = songs[0];
					title = "Added Song to the queue";
					description = `[${song.title}](${song.url})`
					thumbnail = song.thumbnail;
				}
				else
				{
					const playlist = await ytpl(args.getString("name")!);

					title = "Added Songs from Playlist";
					description = `[${playlist.title}](${playlist.url}) (${addedToQueue.length}/${playlist.items.length} songs added)`;
					thumbnail = playlist.bestThumbnail.url;
				}

				const embed = new BotEmbed(client)
					.setTitle(title)
					.setDescription(`${description}\nAdded by ${songs[0].addedBy}`)
					.setThumbnail(thumbnail);

				if (!interaction.replied)
					await interaction.followUp({ embeds: [embed] });
				else
				{
					const queue = client.musicManager.queues.get(interaction.guildId!)!;
					queue.textChannel.send({ embeds: [embed] });
				}
			}
			else
			{
				const embed = new ErrorEmbed(queue.songs.length! == queue.maxSongs ? `The maximum amount songs allowed in a queue is ${queue.maxSongs}.` : "Could not add any songs to the queue.");
				await interaction.followUp({ embeds: [embed], ephemeral: true });
			}
		} catch(error) {
			await interaction.followUp({ embeds: [new ErrorEmbed("Could not play song: " + error)] });
		}
	}

	private playSong(client: ExtendedClient, guildId: string, connection: VoiceConnection, queue: Queue, song: Song, interaction: CommandInteraction | null = null)
	{
		function getResource()
		{
			if (song.url.startsWith("https://cdn.discordapp.com") || song.url.startsWith("https://media.discordapp.net")) {
				return createAudioResource(song.url, { inputType: StreamType.Arbitrary });
			}
			else {
				const stream = ytdl(song.url, {filter: "audioonly", highWaterMark: 1048576 * 32});
				return createAudioResource(stream, {inputType: StreamType.Arbitrary});
			}
		}

		const resource = getResource();

		const player = createAudioPlayer();

		client.musicManager.audioPlayers.set(guildId, player);

		player.play(resource);
		connection.subscribe(player);

		const embed = new BotEmbed(client)
			.setTitle("Now Playing")
			.setDescription(`[${song.title}](${song.url})\nAdded by ${song.addedBy}`)
			.setThumbnail(song.thumbnail);

		if (interaction != null)
			interaction.followUp({ embeds: [embed] });
		else
			queue.textChannel.send({ embeds: [embed] });

		player.on(AudioPlayerStatus.Idle, (oldState: AudioPlayerState) => {
			if (oldState.status != AudioPlayerStatus.Playing) return;

			if(queue.loop == "song" && !queue.skipped)
			{
				this.playSong(client, guildId, connection, queue, queue.songs[queue.currentSong]);
			}
			else
			{
				if (queue.songs[queue.currentSong + 1] != undefined) {
					this.playSong(client, guildId, connection, queue, queue.songs[queue.currentSong + 1]!,);

					queue.currentSong++;
				}
				else if (queue.loop == "queue") {
					this.playSong(client, guildId, connection, queue, queue.songs[0]);
					queue.currentSong = 0;
				}
				else {
					client.musicManager.disconnect(guildId);
				}

				if (queue.skipped) queue.skipped = false;
			}
		});

		player.on("error", (err: AudioPlayerError) => console.log(err));
	}
}