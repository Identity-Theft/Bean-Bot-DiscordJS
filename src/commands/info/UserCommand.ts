import { ApplicationCommandOptionType, CacheType, ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder } from "discord.js";
import { Command, CommandCategory } from "../../classes/Command";
import moment from "moment";
import Bot from "../../classes/Bot";

export default class UserCommand extends Command
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

	public async execute(client: Bot, interaction: CommandInteraction<CacheType>, args: CommandInteractionOptionResolver<CacheType>): Promise<void> {
		const user = args.getUser("user")!;
		const guild = interaction.guild!;
		const guildMember = await guild.members.fetch(user.id);

		const embed = new EmbedBuilder()
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
			])
			.setColor("Blurple")
			.setFooter({
				text: `User ID: ${user.id}`
			});

		interaction.reply({ embeds: [embed] });
	}
}