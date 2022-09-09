import { EmbedBuilder, ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType } from "discord.js";
import Bot from "../../classes/Bot";
import { CommandFunction } from "../../interfaces/Command";

export const data: ApplicationCommandData = {
	name: "avatar",
	description: "Replies with a user\"s avatar.",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "User to get avatar from.",
			required: true,
		}
	],
}

export const run: CommandFunction = async(client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	const user = options.getUser("user")!;

	interaction.reply({ embeds: [
		new EmbedBuilder()
			.setTitle(user.tag)
			.setImage(user.avatarURL())
			.setColor("Blurple")
	]});
}