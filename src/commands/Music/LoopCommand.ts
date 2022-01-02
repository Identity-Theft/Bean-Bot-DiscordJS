import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";
import { simpleEmbed2 } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: 'loop',
	description: 'Loop the current song or the queue.',
	options: [
		{
			type: 'SUB_COMMAND',
			name: 'none',
			description: 'Do not loop.'
		},
		{
			type: 'SUB_COMMAND',
			name: 'song',
			description: 'Loop the current song.'
		},
		{
			type: 'SUB_COMMAND',
			name: 'queue',
			description: 'Loop the queue.'
		}
	]
}

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	if (await client.musicManager.canUseCommand(client, interaction) == false) return;

	client.musicManager.queues.get(interaction.guildId!)!.loop = options.getSubcommand() as 'none' | 'song' | 'queue';
	interaction.reply({ embeds: [simpleEmbed2("Loop", `Now Looping: \`${options.getSubcommand()!}\``)] });
}