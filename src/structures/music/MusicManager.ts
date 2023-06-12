import { Attachment, Snowflake, User } from "discord.js";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import Queue from "./Queue";
import Track, { TrackPlatform } from "./Track";
import NewgroundsResponse from "../interfaces/Music/NewgroundsResponse";
import { Client } from 'spotify-api.js';
import Playlist from "./Playlist";
import getVideoDurationInSeconds from "get-video-duration";
import { apiRequest, searchYoutube } from "../../utils/Utils";

export default class MusicManager
{
	public queues: Map<Snowflake, Queue> = new Map();

	public spotifyClient = new Client({
		token: { clientID: "083aec0db587426484149ca455029799", clientSecret: "f255b424ddce43c4adb145f75703904b" }
	});

	private getUrlFromOption(option: string | Attachment): string | null
	{
		if (option instanceof Attachment) {
			if (!option.contentType?.startsWith("video") && !option.contentType?.startsWith("audio")) return null;
			return option.url;
		}

		return option;
	}

	public async trackFromUrl(option: string | Attachment, addedBy: User): Promise<Track | Playlist>
	{
		let url = this.getUrlFromOption(option);
		const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
		if (!url) throw new Error('Attachment has no playable audio');

		if (!urlRegex.test(url))
			throw new Error('Input must be a URL');
		

		if (option instanceof Attachment)
		{
			return new Track(
				option.name!,
				option.url,
				await getVideoDurationInSeconds(option.url),
				addedBy,
				TrackPlatform.Discord
			)
		}

		const newgroundsRegex = /^https:\/\/(www\.)?newgrounds\.com\/audio\/listen\/\d+$/gm;
		const spotifyTrackRegex = /^https:\/\/open\.spotify\.com\/track\/[A-Z|a-z|0-9]+$/gm;
		const spotifyAlbumRegex = /^https:\/\/open\.spotify\.com\/album\/[A-Z|a-z|0-9]+$/gm;

		if (ytdl.validateURL(url)) return await this.youtubeVideo(url, addedBy);
		if (ytpl.validateID(url)) return await this.youtubePlaylist(url, addedBy);
		if (newgroundsRegex.test(url)) return await this.newgrounds(url, addedBy);

		url = url.split("?si=")[0];

		if (spotifyTrackRegex.test(url)) return await this.spotifyTrack(url, addedBy);
		if (spotifyAlbumRegex.test(url)) return await this.spotifyAlbum(url, addedBy);
		
		throw new Error("No track found")
	}

	public async trackFromSearch(search: string, platform: string, addedBy: User): Promise<Track>
	{
		const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

		if (urlRegex.test(search))
			throw new Error('Input must be a search term');

		if (platform == "youtube")
		{
			const url = await searchYoutube(search);

			if (url)
			{
				const track = await this.youtubeVideo(url, addedBy);
				return track;
			}
			else throw new Error('Could not find video');
		}
		
		const result = await this.spotifyClient.search(search, { types: ['track'] });
		if (!result.tracks) throw new Error("No tracks found")

		const track = result.tracks[0];

		return new Track(
			track.name,
			track.externalURL.spotify,
			track.duration / 1000,
			addedBy,
			TrackPlatform.Spotify,
			track.album?.images[0].url as string | null,
			`by ${track.artists[0].name}`
		);
	}

	private async youtubeVideo(url: string, addedBy: User): Promise<Track>
	{
		const info = await ytdl.getInfo(url);

			if (!info.videoDetails.isLiveContent && !info.videoDetails.age_restricted)
			{
				return new Track(
					info.videoDetails.title,
					info.videoDetails.video_url,
					parseInt(info.videoDetails.lengthSeconds),
					addedBy,
					TrackPlatform.YouTube,
					info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url
				);
			}
			else throw new Error('Live streams and age restricted content cannot be played');
	}

	private async youtubePlaylist(url: string, addedBy: User): Promise<Playlist>
	{
		const ytPlaylist = await ytpl(url);
		const playlist: Playlist = new Playlist(
			ytPlaylist.title,
			ytPlaylist.url,
			ytPlaylist.bestThumbnail.url,
			addedBy,
			TrackPlatform.YouTube
		);

		for (let index = 0; index < ytPlaylist.items.length; index++) {
			const item = ytPlaylist.items[index];
			const track = await this.youtubeVideo(item.url, addedBy);
			playlist.addTrack(track);
		}

		return playlist;
	}

	private async newgrounds(url: string, addedBy: User): Promise<Track>
	{
		const data: NewgroundsResponse = await apiRequest(url.replace("listen", "feed"));

		return new Track(
			data.title,
			url,
			await getVideoDurationInSeconds(data.stream_url),
			addedBy,
			TrackPlatform.Newgrounds,
			data.icons.large,
		);
	}

	private async spotifyTrack(url: string, addedBy: User): Promise<Track>
	{
		const track = await this.spotifyClient.tracks.get(url.replace("https://open.spotify.com/track/", "").split("?")[0]);
		if (!track) throw new Error("No track found");

		return new Track(
			track.name,
			url,
			track.duration / 1000,
			addedBy,
			TrackPlatform.Spotify,
			track.album?.images[0].url as string | null,
			`by ${track.artists[0].name}`
		);
	}

	private async spotifyAlbum(url: string, addedBy: User): Promise<Playlist>
	{
		const album = await this.spotifyClient.albums.get(url.replace("https://open.spotify.com/album/", "").split("?")[0]);
		if (!album || !album.tracks || album.totalTracks == 0) throw new Error("No album found");

		const playlist = new Playlist(
			album.name,
			url,
			album.images[0].url,
			addedBy,
			TrackPlatform.Spotify
		);
		
		for (let index = 0; index < album.totalTracks; index++) {
			const track = album.tracks[index];

			playlist.addTrack(new Track(
				track.name,
				track.externalURL.spotify,
				track.duration / 1000,
				addedBy,
				TrackPlatform.Spotify,
				album.images[0].url,
				`by ${track.artists[0].name}`
			));
		}

		return playlist;
	}
}