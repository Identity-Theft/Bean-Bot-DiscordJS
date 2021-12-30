import { MessageEmbed, MessageEmbedOptions, Snowflake } from "discord.js";
import Bot from "../classes/Bot";

function simpleEmbed(client: Bot, description: string): MessageEmbed
{
	const embed: MessageEmbedOptions = {
		author: {
			name: client.user?.username,
			icon_url: client.user?.avatarURL() as string | undefined
		},
		description: description,
		color: 'BLURPLE'
	};

	return new MessageEmbed(embed);
}

function simpleEmbed2(name: string, description: string): MessageEmbed
{
	const embed: MessageEmbedOptions = {
		title: name,
		description: description,
		color: 'BLURPLE'
	};

	return new MessageEmbed(embed)
}

function errorEmbed(err: string): MessageEmbed
{
	const embed: MessageEmbedOptions = {
		title: "⚠️ Error",
		description: err,
		color: 'RED'
	};

	return new MessageEmbed(embed);
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