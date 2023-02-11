import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { Attachment, ChannelType, CommandInteraction, Snowflake, User } from "discord.js";
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

	public async canUseCommand(interaction: CommandInteraction, command: string): Promise<boolean>
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

		if (command != "play")
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
		const queue = this.queues.get(guildId);

		if (!queue) throw new Error(`No Queue ${guildId}`)

		const songs = queue.songs;
		songs.push(song);
	}

	public disconnect(guildId: Snowflake): void
	{
		this.connections.get(guildId)?.destroy();
		this.connections.delete(guildId);
		this.queues.delete(guildId);
	}

	public getUrlFromOption(option: string | Attachment): string | null
	{
		if (typeof option == "object") {
			if (!option.contentType?.startsWith("video") && !option.contentType?.startsWith("audio")) return null;
			return option.proxyURL;
		}

		return option;
	}

	public async songInfo(option: string | Attachment, addedBy: User): Promise<Song[]>
	{
		const url = this.getUrlFromOption(option);
		let songsToReturn: Array<Song> = [];

		if (!url) throw new Error('Invalid Type');

		if (!url.startsWith("https://") && !url.startsWith("http://"))
		{
			// Find YouTube video with matching name
			const newUrl = await this.findVideo(url);

			if (newUrl)
			{
				const song = await this.songFromURL(newUrl, addedBy);
				songsToReturn = song;
			}
			else throw new Error('Invalid URL');
		}
		else
		{
			songsToReturn = typeof(option) == "string" ? await this.songFromURL(option, addedBy) : [this.songFromAttachment(option, addedBy)];
		}

		return songsToReturn;
	}

	private async songFromURL(url: string, addedBy: User): Promise<Song[]>
	{
		// Check for valid URL
		if (ytdl.validateURL(url))
		{
			// YouTube URL
			const info = await ytdl.getInfo(url);

			if (!info.videoDetails.isLiveContent && !info.videoDetails.age_restricted)
			{
				return [new Song(
					info.videoDetails.title,
					info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
					info.videoDetails.lengthSeconds,
					info.videoDetails.video_url,
					addedBy
				)];
			}
			else throw new Error('Live streams and age restricted content cannot be played');
		}
		else if (ytpl.validateID(url))
		{
			// YouTube playlist URL
			const playlist = await ytpl(url);
			const songsToReturn: Song[] = [];

			for (let index = 0; index < playlist.items.length; index++) {
				const item = playlist.items[index];
				const song = await this.songFromURL(item.url, addedBy);
				songsToReturn.push(song[0]);
			}

			return songsToReturn;
		}
		else throw new Error('Invalid URL');
	}

	private songFromAttachment(attachment: Attachment, addedBy: User): Song
	{
		return new Song(
			attachment.name!,
			null,
			"Unkown",
			attachment.url,
			addedBy
		);
	}

	private async findVideo(search: string): Promise<string | null>
	{
		const result = await ytSearch(search);

		if (!result) return null;

		return result.videos[0].url;
	}
}