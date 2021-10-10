import { MessageButton, MessageActionRow, ApplicationCommandData, CommandInteraction } from "discord.js";
import { Bot } from "../client/Client";
import { RunFunction } from "../interfaces/Command";

export const data: ApplicationCommandData = {
	name: 'button-test',
	description: 'Button Test.',
	options:[],
}
export const test = true;

export const run: RunFunction = async(client: Bot, interaction: CommandInteraction) => {
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('ButtonTest1')
				.setLabel('lmao')
				.setStyle('PRIMARY')
		)

	interaction.reply({ content: '1', components: [row] });
}