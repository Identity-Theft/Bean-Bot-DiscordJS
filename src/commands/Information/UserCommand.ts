import { ApplicationCommandData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder } from "discord.js";
import { CommandFunction } from "../../interfaces/Command";
import moment from "moment";
import Bot from "../../classes/Bot";

export const data: ApplicationCommandData = {
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
}

export const run: CommandFunction = async(client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	const user = options.getUser("user")!;
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
				value: moment.utc(guildMember.joinedAt).format("dddd, MMMM Do YYYY"),
				inline: true
			},
			{
				name: "Account Created",
				value: moment.utc(user.createdAt).format("dddd, MMMM Do YYYY"),
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