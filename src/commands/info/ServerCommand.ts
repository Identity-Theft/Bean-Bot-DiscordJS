import { ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ICommand, CommandCategory } from "../../structures/interfaces/ICommand";
import moment from "moment";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";

export default class ServerCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("server")
		.setDescription("Replies with info about the server.");

	public category: CommandCategory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		const guild = interaction.guild!;
		if(!guild.available) return;

		const sOwner = await guild.members.fetch(guild.ownerId);

		const embed = new BotEmbed()
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
					name: "Partnered",
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
			.setThumbnail(guild.iconURL());

		await interaction.reply({ embeds: [embed] });
	}
}