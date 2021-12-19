import { ApplicationCommandData, CommandInteraction } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";
import { simpleEmbed2 } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: 'music-restrict',
	description: 'Retricts music commands to admins',
	options: []
}
export const test = false;

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.musicManager.canUseCommand(client, interaction) == false) return;

	const queue = await client.musicManager.getQueue(interaction.guildId!)!;

	queue.restricted = !queue.restricted;

	const embed = simpleEmbed2("Restricted", `The queue is now restricted to admins only.`);
	interaction.reply({ embeds: [embed] });
}