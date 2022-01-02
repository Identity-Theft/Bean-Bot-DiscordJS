import { ApplicationCommandData, CommandInteraction, MessageEmbedOptions } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";

export const data: ApplicationCommandData = {
	name: 'bot',
	description: 'Replies with info about Bean Bot.',
	options: []
}

export const run: RunFunction = async(client: Bot, interaction: CommandInteraction) => {
	const user = client.user!;

	const days = Math.floor(client.uptime! / 86400000);
	const hours = Math.floor(client.uptime! / 3600000) % 24;
	const minutes = Math.floor(client.uptime! / 60000) % 60;
	const seconds = Math.floor(client.uptime! / 1000) % 60;

	const embed: MessageEmbedOptions = {
		title: user.username,
		fields: [
			{
				name: "Ping",
				value: `${Math.round(client.ws.ping)} ms`
			},
			{
				name: 'Uptime',
				value: `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`
			},
			// {
			// 	name: 'Shard',
			// 	value: client.shard
			// }
		],
		color: 'BLURPLE',
		footer: {
			text: `User ID: ${user.id}`
		}
	};

	interaction.reply({ embeds: [embed] });
}