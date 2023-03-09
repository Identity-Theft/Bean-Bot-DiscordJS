import { ApplicationCommandOptionData, CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import ISubcommand from "../../interfaces/ISubcommand";
import { RandomCat } from "../../structures/ApiRequests";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";

export default class CatCommand implements ISubcommand
{
	public data: ApplicationCommandOptionData = {
		name: "cat",
		description: "Replies with a random picture of a Cat.",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		interaction.deferReply();

		fetch("https://aws.random.cat/meow")
			.then((response) => response.json())
			.then((data: RandomCat) => interaction.followUp({ embeds: [
				new BotEmbed(client)
					.setTitle("Random Cat")
					.setDescription(`${client.user?.username} uses the [Random Cat API](https://aws.random.cat/).`)
					.setImage(data.file)]
			}));
	}
}