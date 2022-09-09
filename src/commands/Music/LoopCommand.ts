import { ApplicationCommandData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { CommandFunction } from "../../interfaces/Command";
import { simpleEmbed2 } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: "loop",
	description: "Loop the current song or the queue.",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "none",
			description: "Do not loop."
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "song",
			description: "Loop the current song."
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "queue",
			description: "Loop the queue."
		}
	]
}

export const run: CommandFunction = async (client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	if (await client.musicManager.canUseCommand(interaction) == false) return;

	client.musicManager.queues.get(interaction.guildId!)!.loop = options.getSubcommand() as "none" | "song" | "queue";
	interaction.reply({ embeds: [simpleEmbed2("Loop", `Now Looping: \`${options.getSubcommand()!}\``)] });
}