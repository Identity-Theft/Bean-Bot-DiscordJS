import { ApplicationCommandData, ChannelType, CommandInteraction, EmbedBuilder } from "discord.js";
import { CommandFunction } from "../../interfaces/Command";
import moment from "moment";
import Bot from "../../classes/Bot";

export const data: ApplicationCommandData = {
	name: "server",
	description: "Replies with info about the server.",
	options: [],
}

export const run: CommandFunction = async(client: Bot, interaction: CommandInteraction) => {
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
				value: moment.utc(guild.createdAt).format("MMMM Do YYYY"),
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