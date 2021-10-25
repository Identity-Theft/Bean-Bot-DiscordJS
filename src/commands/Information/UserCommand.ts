import { MessageEmbed, ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { RunFunction } from "../../interfaces/Command";
import moment from 'moment';
import Bot from "../../classes/Bot";

export const data: ApplicationCommandData = {
	name: 'user',
	description: 'Replies with info about a user.',
	options: [
		{
			type: 'USER',
			name: 'user',
			description: 'User to get info from.',
			required: true,
		}
	]
}
export const test = true;

export const run: RunFunction = async(client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	const user = options.getUser('user')!;
	const guild = interaction.guild!;
	const guildMember = await guild.members.fetch(user.id);

	const embed = new MessageEmbed()
		.setAuthor(`${user.tag}`, `${user.displayAvatarURL()}`)
		.setThumbnail(`${user.displayAvatarURL()}`)
		.addFields(
			{ name: 'Nickname', value: guildMember.nickname !== null ? `${guildMember.nickname}` : 'None', inline: true},
			{ name: 'Bot', value: user.bot !== false ? 'True' : 'False', inline: true },
			{ name: 'Admin', value: guildMember.permissions.has('ADMINISTRATOR') ? 'True' : 'False', inline: true },
			{ name: 'Joined Server', value: moment.utc(guildMember.joinedAt).format('dddd, MMMM Do YYYY'), inline: true },
			{ name: 'Account Created', value: moment.utc(user.createdAt).format('dddd, MMMM Do YYYY'), inline: true },
			{ name: `Roles [${guildMember.roles.cache.size}]`, value: `${guildMember.roles.cache.map(r => r).join(' ')}` }
		)
		.setColor('BLURPLE')
		.setFooter(`User ID: ${user.id}`);

	interaction.reply({ embeds: [embed] });
}