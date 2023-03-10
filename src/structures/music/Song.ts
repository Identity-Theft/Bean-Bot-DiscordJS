import { User } from "discord.js";

export default class Song
{
	public title: string;
	public thumbnail: string | null;
	public url: string;
	public addedBy: User;

	public constructor(title: string, thumbnail: string | null, url: string, addedBy: User)
	{
		this.title = title;
		this.thumbnail = thumbnail;
		this.url = url;
		this.addedBy = addedBy;
	}
}