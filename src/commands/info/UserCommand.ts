import { ApplicationCommandOptionType, ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { ICommand, CommandCategory } from "../../interfaces/ICommand";
import moment from "moment";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";

export default class UserCommand implements ICommand
{
	public data: ChatInputApplicationCommandData = {
		name: "user",
		description: "Replies with info about a user.",
		options: [
			{
				type: ApplicationCommandOptionType.User,
				name: "user",
				description: "User to get info from.",
				required: true,
			}
		]
	};

	public catergory: CommandCategory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const user = args.getUser("user")!;
		const guild = interaction.guild!;
		const guildMember = await guild.members.fetch(user.id);

		const embed = new BotEmbed(client)
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
					value: user.bot !== false ? "True" : "False",
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

		interaction.reply({ embeds: [embed] });
	}
}