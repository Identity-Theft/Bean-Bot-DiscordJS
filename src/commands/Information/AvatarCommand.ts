import { MessageEmbedOptions, ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";

export const data: ApplicationCommandData = {
	name: 'avatar',
	description: 'Replies with a user\'s avatar.',
	options: [
		{
			type: 'USER',
			name: 'user',
			description: 'User to get avatar from.',
			required: true,
		}
	],
}
export const test = false;

export const run: RunFunction = async(client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	const user = options.getUser('user')!;

	const embed: MessageEmbedOptions = {
		title: user.tag,
		image: {
			url: user.avatarURL()?.toString()
		},
		color: 'BLURPLE'
	};

	interaction.reply({ embeds: [embed] });
}