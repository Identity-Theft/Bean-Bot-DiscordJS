import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { CommandInteraction, Snowflake, User } from "discord.js";
import ytSearch from 'yt-search';
import ytdl from "ytdl-core";
import got from 'got';
import Queue from "./Queue";
import Song from "./Song";
import NewgroundsResponse from "./NewgroundsResponse";
import { errorEmbed } from "../utils/Utils";
import Bot from "./Bot";

class BotMusicManger
{
	private queues: Map<Snowflake, Queue> = new Map();
	private connections: Map<Snowflake, VoiceConnection> = new Map();
	private audioPlayers: Map<Snowflake, AudioPlayer> = new Map();

	public async canUseCommand(client: Bot, interaction: CommandInteraction): Promise<boolean>
	{
		const guildId = interaction.guildId!;
		const member = await interaction.guild?.members.fetch(interaction.user.id);
		const channel = member!.voice.channel;

		if (channel == null)
		{
			interaction.reply({ embeds: [errorEmbed('You are not in a voice channel')], ephemeral: true });
			return false;
		}

		if (this.getQueue(guildId)?.voiceChannel?.type == 'GUILD_STAGE_VOICE' && !member?.permissions.has('ADMINISTRATOR'))
		{
			interaction.reply({ embeds: [errorEmbed('Only admins can use music commands when Bean Bot is in a Stage Channel.')] });
			return false;
		}

		if (this.getQueue(guildId) != undefined && this.getQueue(guildId)!.voiceChannel != channel)
		{
			interaction.reply({ embeds: [errorEmbed('You are not in a voice channel with Bean Bot.')], ephemeral: true});
			return false;
		}

		if (interaction.commandName != 'play')
		{
			if (this.getQueue(guildId) == undefined)
			{
				interaction.reply({ embeds: [errorEmbed('Bean Bot is not in a Voice Channel.')] });
				return false;
			}
		}
		else
		{
			if (channel.type == 'GUILD_VOICE' && !interaction.memberPermissions?.has('ADMINISTRATOR'))
			{
				interaction.reply({ embeds: [errorEmbed(`Only admins can add Bean Bot to Stage Channels. ${channel}`)], ephemeral: true });
				return false;
			}
		}

		return true;
	}

	public addQueue(guildId: Snowflake, queue: Queue): void
	{
		this.queues.set(guildId, queue);
	}

	public addConnection(guildId: Snowflake, connection: VoiceConnection): void
	{
		this.connections.set(guildId, connection);
	}

	public addPlayer(guildId: Snowflake, audioPlayer: AudioPlayer): void
	{
		this.audioPlayers.set(guildId, audioPlayer);
	}

	public addSong(guildId: Snowflake, song: Song): void
	{
		const songs = this.queues.get(guildId)?.songs;
		songs?.push(song);
	}

	public getConnection(guildId: Snowflake): VoiceConnection | undefined
	{
		return this.connections.get(guildId);
	}

	public getQueue(guildId: Snowflake): Queue | undefined
	{
		return this.queues.get(guildId);
	}

	public getPlayer(guildId: Snowflake): AudioPlayer | undefined
	{
		return this.audioPlayers.get(guildId);
	}

	public disconnect(guildId: Snowflake): void
	{
		this.connections.get(guildId)?.destroy();
		this.connections.delete(guildId);
		this.queues.delete(guildId);
	}

	public inQueue(guildId: Snowflake, song: Song, interaction: CommandInteraction): void | boolean
	{
		const queue = this.getQueue(guildId)!;

		for (let i = 0; i < queue.songs.length; i++) {
			const s = queue.songs[i];

			if (s.url == song.url)
			{
				const embed = errorEmbed("Song is already in the queue.");
				interaction.followUp({ embeds: [embed], ephemeral: true });
				return true;
			}
		}

		return false;
	}

	public async songInfo(url: string, addedBy: User): Promise<Song | null>
	{
		if (!url.startsWith('https://'))
		{
			const newUrl = await this.findVideo(url);

			if (newUrl != null)
			{
				const song = await this.songInfo(newUrl, addedBy);
				return song as Song;
			}
			else return null;
		}
		else
		{
			// Check if url is from youtube
			if (ytdl.validateURL(url) == true)
			{
				const song = await ytdl.getInfo(url);

				return new Song(
					song.videoDetails.title,
					url,
					addedBy,
					'YouTube',
					song.videoDetails.thumbnails[song.videoDetails.thumbnails.length - 1].url
				)
			}
			else
			{
				// Check if url is from newgrounds
				if(!url.toLowerCase().startsWith('https://newgrounds.com/audio/listen/') && !url.toLowerCase().startsWith('https://www.newgrounds.com/audio/listen/')) return null;

				const urlParts = url.split('/');
				const id = urlParts[urlParts.length - 1];
				const data: NewgroundsResponse = await got(`https://newgrounds.com/audio/feed/${id}`).json();

				return new Song(
					data.title,
					url,
					addedBy,
					'Newgrounds',
					data.icons.small,
					data.stream_url.split('?')[0],
				);
			}
		}
	}

	private async findVideo (search: string): Promise<string | null>
	{
		const result = await ytSearch(search);

		if (result) return result.videos[0].url;
		else return null;
	}
}

export default BotMusicManger;