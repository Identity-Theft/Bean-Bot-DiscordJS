import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";
import { simpleEmbed } from "../../utils/Utils";

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
export const test = false;

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	if (await client.botMusicManager.canUseCommand(client, interaction) == false) return;

	client.botMusicManager.getQueue(interaction.guildId!)!.loop = options.getSubcommand() as 'none' | 'song' | 'queue';
	interaction.reply({ embeds: [simpleEmbed(client, options.getSubcommand()!)] });
}