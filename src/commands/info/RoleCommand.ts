import { ApplicationCommandOptionType, CacheType, ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, Snowflake } from "discord.js";
import moment from "moment";
import Bot from "../../classes/Bot";
import { Command, CommandCategory } from "../../classes/Command";

export default class RoleCommand extends Command
{
	public data: ChatInputApplicationCommandData = {
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
	};

	public catergory: CommandCategory = CommandCategory.Info;

	public async execute(client: Bot, interaction: CommandInteraction<CacheType>, args: CommandInteractionOptionResolver<CacheType>): Promise<void> {
		const guild = interaction.guild!;
		const roleId: Snowflake = args.getRole("role")!.id;
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
}