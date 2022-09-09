import { ApplicationCommandData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, Snowflake } from "discord.js";
import moment from "moment";
import Bot from "../../classes/Bot";
import { CommandFunction } from "../../interfaces/Command";

export const data: ApplicationCommandData = {
	name: "role",
	description: "Replies with info about a role.",
	options: [
		{
			type: ApplicationCommandOptionType.Role,
			name: "role",
			description: "Role to get info from.",
			required: true
		}
	]
}

export const run: CommandFunction = async(client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	const guild = interaction.guild!;
	const roleId: Snowflake = options.getRole("role")!.id;
	const role = await guild.roles.fetch(roleId)!;

	if (!role) return;

	interaction.reply({ embeds: [
		new EmbedBuilder()
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
			.setFooter({text: `Role ID: ${roleId}`})
	] });
}