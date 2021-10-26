import { MessageEmbed } from "discord.js";
import Bot from "../classes/Bot";

function simpleEmbed(client: Bot, description: string): MessageEmbed
{
	return new MessageEmbed()
		.setAuthor(client.user!.username, client.user?.avatarURL() as string | undefined)
		.setDescription(description)
		.setColor('BLURPLE')
}

function simpleEmbed2(name: string, description: string): MessageEmbed
{
	return new MessageEmbed()
		.setTitle(name)
		.setDescription(description)
		.setColor('BLURPLE')
}

function errorEmbed(err: string): MessageEmbed
{
	return new MessageEmbed()
		.setTitle('Error')
		.setDescription(err)
		.setColor('RED')
}

export { simpleEmbed, simpleEmbed2, errorEmbed };