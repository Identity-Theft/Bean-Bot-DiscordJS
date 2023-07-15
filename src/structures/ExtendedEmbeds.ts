import { EmbedBuilder } from "discord.js";
import { TrackPlatform } from "./music/Track";

export class ErrorEmbed extends EmbedBuilder
{
	public constructor(content: string)
	{
		super();
		this.setDescription(`${content}`);
		this.setColor(0xFF0000);
	}
}

export class TrackEmbed extends EmbedBuilder
{
	public constructor(descrption: string, platform: TrackPlatform)
	{
		super();

		let emoji = ""

		switch (platform)
		{
			case TrackPlatform.Discord:
				emoji = "<:discord:1115914182014017546>";
				this.setColor("Blurple");
				break;
			case TrackPlatform.YouTube:
				emoji = "<:youtube:1115914187047178300>";
				this.setColor(0xFF0000);
				break;
			case TrackPlatform.Newgrounds:
				emoji = "<:newgorunds:1115914183872098324>";
				this.setColor(0xFFB50E);
				break;
			case TrackPlatform.Spotify:
				emoji = "<:spotify:1116325974099886081>";
				this.setColor(0x1ED760);
				break;
		}

		this.setDescription(`${emoji} ${descrption}`)
	}
}

export class BotEmbed extends EmbedBuilder
{
	public constructor()
	{
		super();

		this.setColor("Greyple");
	}
}