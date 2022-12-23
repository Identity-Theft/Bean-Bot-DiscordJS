import { AudioPlayerError, AudioPlayerState, AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, entersState, joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, TextChannel } from "discord.js";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import Queue from "../../classes/Queue";
import Song from "../../classes/Song";
import Bot from "../../classes/Bot";
import { Subcommand } from "../../classes/Subcommand";
import { errorEmbed, simpleEmbed2 } from "../../utils/Utils";

export default class PlayCommand extends Subcommand
{
	public data: ApplicationCommandOptionData = {
		name: "play",
		description: "Add a song to the queue.",
		type: ApplicationCommandOptionType.SubcommandGroup,
		options: [
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "file",
				description: "Upload a audio or video file to add to the queue.",
				options: [
					{
						type: ApplicationCommandOptionType.Attachment,
						name: "song",
						description: "Video or Audio file.",
						required: true
					}
				]
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "name-url",
				description: "Name or url of the song to add to the queue..",
				options: [
					{
						type: ApplicationCommandOptionType.String,
						name: "song",
						description: "Name or url.",
						required: true
					}
				]
			}
		]
	};

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {

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
					this.playSong(client, guildId, connection, newQueue, songs[0]!);
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

				const embed = simpleEmbed2("Queue Created", "Succcessfuly joined the voice channel.");
				await interaction.followUp({ embeds: [embed] });
			}

			const addedToQueue: Array<Song> = [];

			for (let i = 0; i < songs.length; i++) {
				const song = songs[i];
				const inQueue = queue.isSongInQueue(song);

				if (!inQueue && queue.songs.length! < queue.maxSongs)
				{
					addedToQueue.push(song);
					client.musicManager.addSong(guildId, song);

					if (queue.songs.length == 1 && songs.length == 1) return;
				}
				if (inQueue)
				{
					const embed = errorEmbed("This song is already in the queue");
					interaction.reply({ embeds: [embed] });
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

				const embed = new EmbedBuilder()
					.setTitle(title)
					.setDescription(description)
					.setThumbnail(thumbnail)
					.setColor("Blurple")
					.setFooter({
						text: `Added by ${songs[0].addedBy.tag}`,
						iconURL: songs[0].addedBy.avatarURL() as string | undefined
					});

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
				const embed = errorEmbed(queue.songs.length! == queue.maxSongs ? `The maximum amount songs allowed in a queue is ${queue.maxSongs}.` : "Could not add any songs to the queue.");
				await interaction.followUp({ embeds: [embed], ephemeral: true });
			}

			console.log(queue);
		} catch(error) {
			await interaction.followUp({ embeds: [errorEmbed("Could not play song: " + error)] });
		}
	}

	private playSong(client: Bot, guildId: string, connection: VoiceConnection, queue: Queue, song: Song)
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

		const embed = new EmbedBuilder()
			.setTitle("Now Playing")
			.setDescription(`[${song.title}](${song.url})`)
			.setThumbnail(song.thumbnail)
			.setColor("Blurple")
			.setFooter({
				text: `Added by ${song.addedBy.tag}`,
				iconURL: song.addedBy.avatarURL() as string | undefined
			})

		queue.textChannel.send({ embeds: [embed] });

		player.on(AudioPlayerStatus.Idle, (oldState: AudioPlayerState) => {
			if (oldState.status != AudioPlayerStatus.Playing) return;

			if(queue.loop == "song" && !queue.skipped)
			{
				this.playSong(client, guildId, connection, queue, queue.songs[queue.playing]);
			}
			else
			{
				if (queue.songs[queue.playing + 1] != undefined) {
					this.playSong(client, guildId, connection, queue, queue.songs[queue.playing + 1]!,);

					queue.playing++;
				}
				else if (queue.loop == "queue") {
					this.playSong(client, guildId, connection, queue, queue.songs[0]);
					queue.playing = 0;
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