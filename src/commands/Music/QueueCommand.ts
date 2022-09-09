import { ApplicationCommandData, CommandInteraction } from "discord.js";
import Bot from "../../classes/Bot";
import { CommandFunction } from "../../interfaces/Command";
// import { errorEmbed } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: "queue",
	description: "Replies with all the songs in to the queue",
}

export const run: CommandFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.musicManager.canUseCommand(interaction) == false) return;
	const queue = client.musicManager.queues.get(interaction.guildId!)!;

	queue.generateQueueEmbed(interaction);
}