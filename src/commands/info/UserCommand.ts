import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import { ICommand, CommandCategory } from "../../structures/interfaces/ICommand";
import moment from "moment";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";

export default class UserCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("user")
		.setDescription("Replies with info about a user.")
		.addUserOption(new SlashCommandUserOption()
			.setName("user")
			.setDescription("User to get info from.")
			.setRequired(true)
		);

	public category: CommandCategory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const user = args.getUser("user")!;
		const guild = interaction.guild!;
		const guildMember = await guild.members.fetch(user.id);

		const embed = new BotEmbed()
			.setAuthor({
				name: user.tag,
				iconURL: user.avatarURL() as string | undefined
			})
			.setThumbnail(user.avatarURL())
			.addFields([
				{
					name: "Nickname",
					value: guildMember.nickname !== null ? `${guildMember.nickname}` : "None",
					inline: true
				},
				{
					name: "Bot",
					value: user.bot ? "True" : "False",
					inline: true
				},
				{
					name: "Admin",
					value: guildMember.permissions.has("Administrator") ? "True" : "False",
					inline: true
				},
				{
					name: "Joined Server",
					value: `<t:${moment.utc(guildMember.joinedAt).unix()}:R>`,
					inline: true
				},
				{
					name: "Account Created",
					value: `<t:${moment.utc(user.createdAt).unix()}:R>`,
					inline: true
				},
				{
					name: `Roles [${guildMember.roles.cache.size}]`,
					value: `${guildMember.roles.cache.map(r => r).join(" ")}`,
				}
			]);

		await interaction.reply({ embeds: [embed] });
	}
}