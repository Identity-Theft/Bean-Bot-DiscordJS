import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import { ICommand, CommandCategory } from "../../structures/interfaces/ICommand";

export default class RoleCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("role")
		.setDescription("Replies with info about a role.")
		.addUserOption(new SlashCommandUserOption()
			.setName("role")
			.setDescription("Role to get info from.")
			.setRequired(true)
		);

	public category: CommandCategory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const role = args.getRole("role", true);

		if (!role) return;

		await interaction.reply({ embeds: [
			new BotEmbed()
				.setDescription(role.name)
				.addFields([
					{
						name: "Mentionable",
						value: role.mentionable ? "True" : "False",
						inline: true
					},
					{
						name: "Hex Colour",
						value: role.color.toString(),
						inline: true
					},
					// {
					// 	name: "Permissions",
					// 	value: role.permissions.map(p => p).join(" "),
					// 	inline: true
					// },
					{
						name: "Hoisted",
						value: role.hoist ? "True" : "False",
						inline: true
					},
					{
						name: "Position",
						value: role.position.toString(),
						inline: true
					}
				])
				.setColor(role.color)
		] });
	}
}