import { MessageEmbed, Snowflake } from "discord.js";
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

async function getChannel(client: Bot, guildId: Snowflake, channelId: Snowflake): Promise<string | undefined>
{
	const guild = await client.guilds.fetch(guildId);
	const channel = await guild.channels.cache.find(c => c.id == channelId);
	return channel?.name;
}

const formatInt = (int: number) => (int < 10 ? `0${int}` : int);

function formatDuration(sec: number): string {
	if (!sec || !Number(sec)) return "00:00";
	const seconds = Math.round(sec % 60);
	const minutes = Math.floor((sec % 3600) / 60);
	const hours = Math.floor(sec / 3600);
	if (hours > 0) return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
	if (minutes > 0) return `${formatInt(minutes)}:${formatInt(seconds)}`;
	return `00:${formatInt(seconds)}`;
}

export { simpleEmbed, simpleEmbed2, errorEmbed, getChannel, formatDuration };