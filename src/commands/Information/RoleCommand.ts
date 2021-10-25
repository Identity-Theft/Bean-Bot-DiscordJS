import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, MessageEmbed, Snowflake } from 'discord.js';
import moment from 'moment';
import Bot from '../../classes/Bot';
import { RunFunction } from '../../interfaces/Command';

export const data: ApplicationCommandData = {
	name: 'role',
	description: 'Replies with info about a role.',
	options: [
		{
			type: 'ROLE',
			name: 'role',
			description: 'Role to get info from.',
			required: true
		}
	]
}
export const test = true;

export const run: RunFunction = async(client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	const guild = interaction.guild!;
	const roleId: Snowflake = options.getRole('role')!.id;
	const role = await guild.roles.fetch(roleId)!;

	if (!role) return;

	const embed = new MessageEmbed()
		.setTitle(role.name)
		.addFields(
			{ name: 'Mentionable', value: role.mentionable ? 'True' : 'False', inline: true },
			{ name: 'Hex Colour', value: role.hexColor.toString(), inline: true },
			// { name: 'Permissions', value: role.permissions.map(p => p).join(' '), inline: true },
			{ name: 'Hoisted', value: role.hoist ? 'True' : 'False', inline: true },
			{ name: 'Role Created', value: moment.utc(role.createdAt).format('dddd, MMMM Do YYYY')!, inline: true },
			{ name: 'Position', value: role.position.toString(), inline: true },
		)
		.setColor(role.color)
		.setFooter(`Role ID: ${roleId}`);

	interaction.reply({ embeds: [embed] });
}