import { User } from "discord.js";

class Song
{
	public title = '';
	public thumbnail: string | null = null;
	public url = '';
	public streamUrl = ''
	public addedBy: User | null = null;
	public platform = '';

	public constructor(title: string, url: string, addedBy: User, platform: string, thumbnail?: string | undefined, streamUrl?: string | undefined)
	{
		this.title = title;
		this.url = url;
		this.addedBy = addedBy;
		this.platform = platform;

		if (streamUrl != undefined) this.streamUrl = streamUrl;
		if (thumbnail != undefined) this.thumbnail = thumbnail;
	}
}

export default Song;