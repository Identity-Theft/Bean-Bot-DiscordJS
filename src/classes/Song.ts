import { User } from "discord.js";
import { formatDuration } from "../utils/Utils";

export default class Song
{
	public title: string;
	public thumbnail: string | null;
	public formattedDuration: string;
	public url: string;
	public addedBy: User;

	public constructor(title: string, thumbnail: string | null, duration: string, url: string, addedBy: User, )
	{
		this.title = title;
		this.thumbnail = thumbnail;
		this.formattedDuration = formatDuration(parseInt(duration));
		this.url = url;
		this.addedBy = addedBy;
	}
}