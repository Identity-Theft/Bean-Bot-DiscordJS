import { AudioPlayerState, AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, MessageEmbed, TextChannel } from "discord.js";
import ytdl from "ytdl-core";
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
export const test = false;

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	if (await client.botMusicManager.canUseCommand(client, interaction) == false) return;

	const guildId = interaction.guildId!;
	const member = await interaction.guild?.members.fetch(interaction.user.id);
	const channel = member!.voice.channel!;

	function playSong(song: Song, connection: VoiceConnection, queue: Queue) {
		function getResource() {
			if (song.platform == "YouTube") {
				const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1048576 * 32 });
				return createAudioResource(stream, { inputType: StreamType.Arbitrary });
			}
			else {
				return createAudioResource(song.streamUrl, { inputType: StreamType.Arbitrary });
			}
		}

		const resource = getResource();

		// if (resource.playbackDuration == 0) {
		// 	if (queue.songs.length == 0) {
		// 		client.botMusicManager.disconnect(guildId);
		// 	}
		// 	return;
		// }

		const player = createAudioPlayer();

		client.botMusicManager.addPlayer(guildId, player);

		player.play(resource);
		connection.subscribe(player);

		const embed = new MessageEmbed()
			.setTitle('Now Playing')
			.setDescription(`[${song?.title}](${song?.url}) (${song?.platform})`)
			.setFooter(`Added by ${song?.addedBy?.tag}`, song?.addedBy?.avatarURL() as string | undefined)
			.setColor('BLURPLE')

		if (song.thumbnail) embed.setThumbnail(song.thumbnail!);

		queue.textChannel?.send({ embeds: [embed], reply: undefined });

		player.on('stateChange', (oldState: AudioPlayerState, newState: AudioPlayerState) =>{
			if (newState.status == AudioPlayerStatus.Idle && oldState.status == AudioPlayerStatus.Playing) {

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
						client.botMusicManager.disconnect(guildId);
					}
				}
			}
		})
	}

	interaction.deferReply();

	// Create song
	const song = await client.botMusicManager.songInfo(options.getString('song')!, interaction.user);
	if (song == null) {
		interaction.followUp({ embeds: [errorEmbed('Could not play song.')] });
		return;
	}

	// Create queue if one doesn't exist
	if (client.botMusicManager.getQueue(guildId) == undefined)
	{
		const guild = await client.guilds.fetch(guildId);
		const textChannel = await guild.channels.fetch(interaction.channelId!);

		const connection = joinVoiceChannel({ channelId: channel.id, guildId: guildId, adapterCreator: createDiscordJSAdapter(channel) });
		const queue = new Queue(channel, textChannel as TextChannel, interaction.user);

		client.botMusicManager.addConnection(guildId, connection);
		client.botMusicManager.addQueue(guildId, queue);

		connection.on(VoiceConnectionStatus.Ready, async () => {
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
				client.botMusicManager.disconnect(guildId);
			}
		});

		const embed = simpleEmbed2("Queue Created", "Succcessfuly joined the voice channel.");
		interaction.followUp({ embeds: [embed] });
	}
	else
	{
		const inQueue = client.botMusicManager.inQueue(guildId, song, interaction);

		if (inQueue == false)
		{
			const embed = new MessageEmbed()
				.setTitle('Added Song to the Queue')
				.setDescription(`[${song?.title}](${song?.url}) (${song?.platform})`)
				.setFooter(`Added by ${song?.addedBy?.tag}`, song?.addedBy?.avatarURL() as string | undefined)
				.setColor('BLURPLE')

			if (song?.thumbnail != null) embed.setThumbnail(song.thumbnail);
			interaction.followUp({ embeds: [embed] });
		}
		else return;
	}

	client.botMusicManager.addSong(guildId, song!);
}