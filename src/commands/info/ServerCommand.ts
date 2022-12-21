import { CacheType, ChannelType, ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder } from "discord.js";
import { Command, CommandCategory } from "../../classes/Command";
import moment from "moment";
import Bot from "../../classes/Bot";

export default class ServerCommand extends Command
{
	public data: ChatInputApplicationCommandData = {
		name: "server",
		description: "Replies with info about the server.",
		options: [],
	};

	public catergory: CommandCategory = CommandCategory.Info;

	public async execute(client: Bot, interaction: CommandInteraction<CacheType>, args: CommandInteractionOptionResolver<CacheType>): Promise<void> {
		const guild = interaction.guild!;
		if(!guild.available) return;

		const sOwner = await guild.members.fetch(guild.ownerId);

		const embed = new EmbedBuilder()
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL() as string | undefined
			})
			.addFields([
				{
					name: "Owner",
					value: `${sOwner}`,
					inline: true
				},
				{
					name: "Creation Date",
					value: `<t:${moment.utc(guild.createdAt).unix()}:R>`,
					inline: true
				},
				{
					name: "Partnerd",
					value: guild.partnered ? "True" : "False",
					inline: true
				},
				{
					name: "Verified",
					value: guild.verified ? "True" : "False",
					inline: true
				},
				{
					name:"Boost Level",
					value: `[${guild.premiumTier}](https://discord.com/developers/docs/resources/guild#guild-object-premium-tier)`,
					inline: true
				},
				{
					name: "Boosts",
					value: guild.premiumSubscriptionCount!.toString(),
					inline: true
				},
				{
					name: "Verification Level",
					value: `[${guild.verificationLevel}](https://discord.com/developers/docs/resources/guild#guild-object-verification-level)`,
					inline: true
				},
				{
					name: "Channel Categories",
					value: guild.channels.cache.filter(e => e.type == ChannelType.GuildCategory).size.toString(),
					inline: true
				},
				{
					name: "Text Channels",
					value: guild.channels.cache.filter(e => e.type == ChannelType.GuildText).size.toString(),
					inline: true
				},
				{
					name: "Voice Channels",
					value: guild.channels.cache.filter(e => e.type == ChannelType.GuildVoice).size.toString(),
					inline: true
				},
				{
					name: "Members",
					value: `${guild.memberCount}/${guild.maximumMembers}`,
					inline: true
				},
				{
					name: "Roles",
					value: guild.roles.cache.size.toString(),
					inline: true
				},
				{
					name: "Emojis",
					value: guild.emojis.cache.size.toString(),
					inline: true
				}
			])
			.setThumbnail(guild.iconURL())
			.setColor("Blurple")
			.setFooter({
				text: `Server ID: ${guild.id}`
			});


		interaction.reply({ embeds: [embed] });
	}
}