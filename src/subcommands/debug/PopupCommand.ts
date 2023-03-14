import { CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class PopupCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("popup")
		.setDescription("hehe haha funny balls");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		const field1 = new TextInputBuilder()
			.setLabel("Credit Card Info")
			.setStyle(TextInputStyle.Short)
			.setCustomId("text1");

		const row = new ActionRowBuilder<TextInputBuilder>()
			.addComponents([field1]);

		const modal = new ModalBuilder()
			.setTitle("Sex")
			.addComponents(row)
			.setCustomId("modal-test");

		interaction.showModal(modal);
	}
}