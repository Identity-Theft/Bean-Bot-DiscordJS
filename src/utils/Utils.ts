import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { RequestInit } from 'node-fetch';
import ytSearch from "yt-search";

const formatInt = (int: number) => (int < 10 ? `0${int}` : int);

export function formatDuration(sec: number): string
{
	const seconds = Math.round(sec % 60);
	const minutes = Math.floor((sec % 3600) / 60);
	const hours = Math.floor(sec / 3600);
	if (hours > 0) return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
	if (minutes > 0) return `${formatInt(minutes)}:${formatInt(seconds)}`;
	return `00:${formatInt(seconds)}`;
}

export function capitalizeFirstLetter(text: string): string
{
	return text[0].toUpperCase() + text.slice(1);
}

export async function apiRequest(url: string, options: RequestInit = {}): Promise<any>
{

	// eslint-disable-next-line no-new-func
	const importDynamic = new Function('modulePath', 'return import(modulePath)');

	const fetch = async (url: string, options: RequestInit) => {
		const module = await importDynamic('node-fetch');
		return module.default(url, options);
	};

	let data;

	await fetch(url, options)
		.then((response) => response.json())
		.then((json) => data = json)
		.catch((err) => console.log(err));

	return data;
}

export async function searchYoutube(search: string, durationSeconds = 0): Promise<string | null>
{
	const result = await ytSearch(search);

	if (!result) return null;

	if (durationSeconds > 0)
	{
		const videos = result.videos.filter((r) => r.seconds > durationSeconds-5 && r.seconds < durationSeconds+5);

		if (videos.length == 0) return null;

		return videos[0].url;
	}

	return result.videos[0].url;
}

export function getRow(page: number, total: number, type: string): ActionRowBuilder<any>
{
	return new ActionRowBuilder<any>()
		.setComponents(
			new ButtonBuilder()
				.setCustomId(`${type}-FirstPage`)
				.setLabel("<<")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page === 0),
			new ButtonBuilder()
				.setCustomId(`${type}-PrevPage`)
				.setLabel("<")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page === 0),
			new ButtonBuilder()
				.setCustomId(`${type}-NextPage`)
				.setLabel(">")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page === total - 1),
			new ButtonBuilder()
				.setCustomId(`${type}-LastPage`)
				.setLabel(">>")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page === total - 1),
		);
}