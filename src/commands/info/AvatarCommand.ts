import { EmbedBuilder, CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType, ChatInputApplicationCommandData } from "discord.js";
import Bot from "../../classes/Bot";
import { Command, CommandCategory } from "../../classes/Command";

export default class AvatarCommand extends Command
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

	public async execute(client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver): Promise<void>
	{
		const user = options.getUser("user")!;

		interaction.reply({ embeds: [
			new EmbedBuilder()
				.setTitle(user.tag)
				.setImage(user.avatarURL())
				.setColor("Blurple")
		]});
	}
}