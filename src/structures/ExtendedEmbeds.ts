import { EmbedBuilder } from "discord.js";
import ExtendedClient from "./ExtendedClient";

export class ErrorEmbed extends EmbedBuilder
{
	public constructor(content: string)
	{
		super();

		this.setTitle("⚠️ Error",);
		this.setDescription(content);
		this.setColor("Red");
	}
}

export class BotEmbed extends EmbedBuilder
{
	public constructor(client: ExtendedClient)
	{
		super();

		this.setFooter({text: client.user?.username as string, iconURL: client.user?.avatarURL() as string | undefined});
		this.setColor("Blurple");
	}
}