import { ApplicationCommandData, CommandInteraction } from "discord.js";
import Bot from "../../classes/Bot";
import { CommandFunction } from "../../interfaces/Command";
import { simpleEmbed2 } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: "stop",
	description: "Disconnet Bean Bot from the Voice Channel and clear the queue.",
	options: []
}

export const run: CommandFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.musicManager.canUseCommand(interaction) == false) return;

	client.musicManager.disconnect(interaction.guildId!);

	const embed = simpleEmbed2("Disconnected", `${client.user?.username} was disconnected by ${interaction.user}`);
	interaction.reply({ embeds: [embed] });
}