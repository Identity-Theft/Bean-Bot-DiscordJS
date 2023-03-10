import { CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType, ChatInputApplicationCommandData } from "discord.js";
import { CommandCategory, ICommand } from "../../interfaces/ICommand";
import ExtendedClient from "../../structures/ExtendedClient";

export default class TvShowCommand implements ICommand
{
	public data: ChatInputApplicationCommandData = {
		name: "tv-show",
		description: "Replies with info about a TV Show.",
		options: [
			{
				name: "title",
				description: "Title of the TV Show to search for.",
				type: ApplicationCommandOptionType.String,
				required: true
			}
		]
	};

	public catergory: CommandCategory = CommandCategory.Deprecated;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		interaction.reply("no.")
	}
}