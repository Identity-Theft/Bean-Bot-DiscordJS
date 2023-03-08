import { CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType, ChatInputApplicationCommandData, CacheType } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import { ICommand, CommandCategory } from "../../interfaces/ICommand";

export default class GayCommand implements ICommand
{
	public data: ChatInputApplicationCommandData = {
		name: "gay",
		description: "Determines how gay a user is.",
		options: [
			{
				name: "user",
				description: "User.",
				type: ApplicationCommandOptionType.User,
				required: true
			}
		]
	};

	public catergory: CommandCategory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction<CacheType>, args: CommandInteractionOptionResolver<CacheType>): Promise<void> {
		const user = args.getUser("user");
		const percent = (Math.random() * 100).toFixed(0);
		const embed = new BotEmbed(client).setDescription(`${user} is ${percent}% gay.`);
		interaction.reply({ embeds: [embed] });
	}
}