import { Snowflake } from "discord.js";
import ExtendedClient from "../structures/ExtendedClient";

export async function getChannel(client: ExtendedClient, guildId: Snowflake, channelId: Snowflake): Promise<string | undefined>
{
	const guild = await client.guilds.fetch(guildId);
	const channel = guild.channels.cache.find(c => c.id == channelId);
	return channel?.name;
}

const formatInt = (int: number) => (int < 10 ? `0${int}` : int);

export function formatDuration(sec: number): string
{
	if (!sec || !Number(sec)) return "00:00";
	const seconds = Math.round(sec % 60);
	const minutes = Math.floor((sec % 3600) / 60);
	const hours = Math.floor(sec / 3600);
	if (hours > 0) return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
	if (minutes > 0) return `${formatInt(minutes)}:${formatInt(seconds)}`;
	return `00:${formatInt(seconds)}`;
}

export function captilizeFirstLetter(text: string): string
{
	return text[0].toUpperCase() + text.slice(1);
}