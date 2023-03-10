import { ApplicationCommandOptionData, CommandInteraction, CacheType, CommandInteractionOptionResolver, ApplicationCommandOptionType } from "discord.js";
import ISubcommand from "../../interfaces/ISubcommand";
import ExtendedClient from "../../structures/ExtendedClient";

export default class MovieCommand implements ISubcommand
{
	data: ApplicationCommandOptionData = {
		name: "movie",
		description: "Gets info about a movie",
		type: ApplicationCommandOptionType.Subcommand,
		options: [
			{
				name: "title",
				description: "Move title",
				type: ApplicationCommandOptionType.String,
				required: true
			}
		]
	};

	execute(client: ExtendedClient, interaction: CommandInteraction<CacheType>, args: CommandInteractionOptionResolver<CacheType>): Promise<void> {
		throw new Error("Method not implemented.");
	}
}