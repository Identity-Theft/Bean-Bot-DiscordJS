import { CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType, ChatInputApplicationCommandData } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import { ICommand, CommandCategory } from "../../interfaces/ICommand";

export default class AvatarCommand implements ICommand
{
	data: ChatInputApplicationCommandData = {
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
	};

	catergory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const user = args.getUser("user")!;

		interaction.reply({ embeds: [
			new BotEmbed(client)
				.setTitle(user.tag)
				.setImage(user.avatarURL())
		]});
	}
}