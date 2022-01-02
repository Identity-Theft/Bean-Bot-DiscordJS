import { AudioPlayerState, AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, MessageEmbedOptions, TextChannel } from "discord.js";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import Queue from "../../classes/Queue";
import Song from "../../classes/Song";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";
import { errorEmbed, simpleEmbed2 } from "../../utils/Utils";
import { createDiscordJSAdapter } from "../../utils/VoiceUtils";

export const data: ApplicationCommandData = {
	name: 'play',
	description: 'Add a song to the queue.',
	options: [
		{
			type: 'STRING',
			name: 'song',
			description: 'Song name or url.',
			required: true
		}
	]
}

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	if (await client.musicManager.canUseCommand(client, interaction) == false) return;

	const guildId = interaction.guildId!;
	const member = await interaction.guild?.members.fetch(interaction.user.id);
	const channel = member!.voice.channel!;

	function playSong(song: Song, connection: VoiceConnection, queue: Queue) {
		function getResource() {
			const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1048576 * 32 });
			return createAudioResource(stream, { inputType: StreamType.Arbitrary });
		}

		const resource = getResource();

		const player = createAudioPlayer();

		client.musicManager.audioPlayers.set(guildId, player);

		player.play(resource);
		connection.subscribe(player);

		const embed: MessageEmbedOptions = {
			title: "Now Playing",
			description: `[${song.title}](${song.url})`,
			thumbnail: {
				url: song.thumbnail
			},
			color: 'BLURPLE',
			footer: {
				text: `Added by ${song.addedBy.tag}`,
				icon_url: song.addedBy.avatarURL() as string | undefined
			}
		};

		queue.textChannel.send({ embeds: [embed] });

		player.on('stateChange', (oldState: AudioPlayerState, newState: AudioPlayerState) =>{
			if (newState.status == AudioPlayerStatus.Idle && oldState.status == AudioPlayerStatus.Playing )
			{

				if(queue.loop == 'song') {
					playSong(queue.songs[queue.playing], connection, queue);
				}
				else {
					if (queue.songs[queue.playing + 1] != undefined) {
						playSong(queue.songs[queue.playing + 1]!, connection, queue);
						queue.playing++;
					}
					else if (queue.loop == 'queue') {
						playSong(queue.songs[0], connection, queue);
						queue.playing = 0;
					}
					else {
						client.musicManager.disconnect(guildId);
					}
				}
			}
		})
	}

	interaction.deferReply();

	// Create song
	const song = await client.musicManager.songInfo(options.getString('song')!, interaction.user);
	if (song == null) {
		interaction.followUp({ embeds: [errorEmbed('Could not play song.')] });
		return;
	}

	const songsToAdd: Array<Song> = [];

	// Create queue if one doesn't exist
	if (client.musicManager.queues.get(interaction.guildId!) == undefined)
	{
		const guild = await client.guilds.fetch(guildId);
		const textChannel = await guild.channels.fetch(interaction.channelId!);

		const connection = joinVoiceChannel({ channelId: channel.id, guildId: guildId, adapterCreator: createDiscordJSAdapter(channel) });
		const queue = new Queue(channel, textChannel as TextChannel, interaction.user);

		client.musicManager.connections.set(guildId, connection);
		client.musicManager.queues.set(guildId, queue);

		connection.on(VoiceConnectionStatus.Ready, async () => {
			if (Array.isArray(song))
				playSong(song[0]!, connection, queue);
			else
				playSong(song!, connection, queue);
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
		interaction.followUp({ embeds: [embed] });
	}
	else
	{
		if (!Array.isArray(song))
		{
			const inQueue = client.musicManager.inQueue(guildId, song);

			if (inQueue == false)
			{
				const embed: MessageEmbedOptions = {
					title: "Added Song to the Queue",
					description: `[${song.title}](${song.url})`,
					thumbnail: {
						url: song.thumbnail
					},
					color: 'BLURPLE',
					footer: {
						text: `Added by ${song.addedBy.tag}`,
						icon_url: song.addedBy.avatarURL() as string | undefined
					}
				};

				interaction.followUp({ embeds: [embed] });
			}
			else
			{
				const embed = errorEmbed("Song is already in the queue.");
				interaction.followUp({ embeds: [embed], ephemeral: true });
				return;
			}

			const queue = client.musicManager.queues.get(interaction.guildId!)!;

			if (queue.songs.length == queue.maxSongs)
			{
				const embed = errorEmbed(`Cannot have more than ${queue.maxSongs} songs in a queue.`);
				interaction.followUp({ embeds: [embed] });
				return;
			}
		}
	}

	if (Array.isArray(song))
	{
		for (let i = 0; i < song.length; i++) {
			const s = song[i];
			const inQueue = client.musicManager.inQueue(guildId, s);
			const queue = client.musicManager.queues.get(interaction.guildId!)!;

			if (!inQueue && queue.songs.length! < queue.maxSongs)
			{
				songsToAdd.push(s);
				client.musicManager.addSong(guildId, s);
			}
		}

		if (songsToAdd.length != 0)
		{
			const playlist = await ytpl(options.getString("song")!);

			const embed: MessageEmbedOptions = {
				title: "Added Songs from Playlist",
				description: `[${playlist.title}](${playlist.url}) (${songsToAdd.length}/${playlist.items.length} songs added)`,
				thumbnail: {
					url: playlist.bestThumbnail.url?.toString()
				},
				color: 'BLURPLE',
				footer: {
					text: `Added by ${song[0].addedBy.tag}`,
					icon_url: song[0].addedBy.avatarURL() as string | undefined
				}
			};

			if (!interaction.replied)
				interaction.followUp({ embeds: [embed] });
			else
			{
				const queue = client.musicManager.queues.get(interaction.guildId!)!;
				queue.textChannel.send({ embeds: [embed] });
			}
		}
		else
		{
			const embed = errorEmbed("Could not add any songs to the queue.");
			interaction.followUp({ embeds: [embed], ephemeral: true });
		}
	}
	else client.musicManager.addSong(guildId, song!);
}