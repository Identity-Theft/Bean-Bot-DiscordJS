import { User } from "discord.js";
import { formatDuration } from "../utils/Utils";

export default class Song
{
	public title: string;
	public thumbnail: string;

	public duration = "";
	public fortmatedDuration = "";

	public likes: number;
	public views: string;

	public url: string;

	public addedBy: User;

	public constructor(title: string, thumbnail: string, duration: string, likes: number, views: string, url: string, addedBy: User, )
	{
		this.title = title;
		this.thumbnail = thumbnail;
		this.duration = duration;
		this.likes = likes;
		this.views = views;
		this.fortmatedDuration = formatDuration(parseInt(duration))
		this.url = url;
		this.addedBy = addedBy;
	}
}