import { ApplicationCommandOptionData, CommandInteraction, ApplicationCommandOptionType, RoleSelectMenuBuilder, ActionRowBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../interfaces/ISubcommand";

export default class RoleMenuCommand implements ISubcommand
{
	public data: ApplicationCommandOptionData = {
		name: "role-menu",
		description: "role menu test",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		const roleMenu = new RoleSelectMenuBuilder()
			.setCustomId("self-roles");

		const row = new ActionRowBuilder<any>()
			.addComponents([roleMenu]);

		await interaction.reply({ content: "funny role menu", components: [row] });
	}
}