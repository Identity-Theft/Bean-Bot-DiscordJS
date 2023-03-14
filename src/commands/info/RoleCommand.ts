import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, SlashCommandUserOption, Snowflake } from "discord.js";
import moment from "moment";
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
		) as SlashCommandBuilder;

	public catergory: CommandCategory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const guild = interaction.guild!;
		const roleId: Snowflake = args.getRole("role")!.id;
		const role = await guild.roles.fetch(roleId)!;

		if (!role) return;

		interaction.reply({ embeds: [
			new BotEmbed(client)
				.setTitle(role.name)
				.addFields([
					{
						name: "Mentionable",
						value: role.mentionable ? "True" : "False",
						inline: true
					},
					{
						name: "Hex Colour",
						value: role.hexColor.toString(),
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
						name: "Role Created",
						value: moment.utc(role.createdAt).format("dddd, MMMM Do YYYY")!,
						inline: true },
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