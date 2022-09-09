import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { ChannelType, CommandInteraction, Snowflake, User } from "discord.js";
import ytSearch from "yt-search";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import Queue from "./Queue";
import Song from "./Song";
import { errorEmbed } from "../utils/Utils";
export default class MusicManager
{
	public queues: Map<Snowflake, Queue> = new Map();
	public connections: Map<Snowflake, VoiceConnection> = new Map();
	public audioPlayers: Map<Snowflake, AudioPlayer> = new Map();

	public async canUseCommand(interaction: CommandInteraction): Promise<boolean>
	{
		const guildId = interaction.guildId!;
		const member = await interaction.guild?.members.fetch(interaction.user.id);
		const channel = member!.voice.channel;

		if (channel == null)
		{
			interaction.reply({ embeds: [errorEmbed("You are not in a voice channel")], ephemeral: true });
			return false;
		}

		if (this.queues.get(guildId)?.voiceChannel.type == ChannelType.GuildStageVoice && !member?.permissions.has("Administrator"))
		{
			interaction.reply({ embeds: [errorEmbed("Only admins can use music commands when Bean Bot is in a Stage Channel.")] });
			return false;
		}

		if (this.queues.get(guildId) != undefined && this.queues.get(guildId)!.voiceChannel != channel)
		{
			interaction.reply({ embeds: [errorEmbed("You are not in a voice channel with Bean Bot.")], ephemeral: true});
			return false;
		}

		if (interaction.commandName != "play")
		{
			if (this.queues.get(guildId) == undefined)
			{
				interaction.reply({ embeds: [errorEmbed("Bean Bot is not in a Voice Channel.")] });
				return false;
			}
		}
		else
		{
			if (channel.type == ChannelType.GuildStageVoice && !interaction.memberPermissions?.has("Administrator"))
			{
				interaction.reply({ embeds: [errorEmbed(`Only admins can add Bean Bot to Stage Channels. ${channel}`)], ephemeral: true });
				return false;
			}
		}

		return true;
	}

	public addSong(guildId: Snowflake, song: Song): void
	{
		const songs = this.queues.get(guildId)?.songs;
		songs?.push(song);
	}

	public disconnect(guildId: Snowflake): void
	{
		this.connections.get(guildId)?.destroy();
		this.connections.delete(guildId);
		this.queues.delete(guildId);
	}

	public inQueue(guildId: Snowflake, song: Song): boolean
	{
		const queue = this.queues.get(guildId)!;

		for (let i = 0; i < queue.songs.length; i++) {
			const s = queue.songs[i];

			if (s.url == song.url)
			{
				return true;
			}
		}

		return false;
	}

	public async songInfo(url: string, addedBy: User): Promise<Song | Song[] | null>
	{
		if (!url.startsWith("https://"))
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
			if (ytdl.validateURL(url))
			{
				// YouTube Url
				const info = await ytdl.getInfo(url);

				if (!info.videoDetails.isLiveContent && !info.videoDetails.age_restricted)
				{
					return new Song(
						info.videoDetails.title,
						info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
						info.videoDetails.lengthSeconds,
						isNaN(info.videoDetails.likes!) ? 0 : info.videoDetails.likes!,
						info.videoDetails.viewCount,
						info.videoDetails.video_url,
						addedBy
					)
				}
				else return null;
			}
			else if (ytpl.validateID(url))
			{
				const playlist = await ytpl(url);
				const songs: Array<Song> = [];

				for (let index = 0; index < playlist.items.length; index++) {
					const item = playlist.items[index];
					const song = await this.songInfo(item.url, addedBy);
					songs.push(song as Song);
				}

				return songs;
			}
			else return null;
		}
	}

	private async findVideo (search: string): Promise<string | null>
	{
		const result = await ytSearch(search);

		if (result) return result.videos[0].url;
		else return null;
	}
}