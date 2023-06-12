import { User } from "discord.js";
import { formatDuration } from "../../utils/Utils";
import Track, { TrackPlatform } from "./Track";

export default class Playlist
{
    public title: string;
    public url: string;
    public thumbnail: string | null;

    public duration: string = "";
	public durationSeconds: number = 0;

    public requestedBy: User;
    
    public tracks: Track[] = [];
    public platform: TrackPlatform;

    public constructor(title: string, url: string, thumbnail: string | null, requestedBy: User, platform: TrackPlatform)
    {
        this.title = `**${title}**`;
        this.url = url;
        this.thumbnail = thumbnail;
        this.requestedBy = requestedBy;
        this.platform = platform;
    }

    public addTrack(track: Track)
    {
        this.tracks.push(track);

		this.durationSeconds += track.durationSeconds;
        this.duration = formatDuration(this.durationSeconds);
    }
}