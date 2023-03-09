import { ApplicationCommandOptionData, CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import ISubcommand from "../../interfaces/ISubcommand";
import { RandomDog } from "../../structures/ApiRequests";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";

export default class DogCommand implements ISubcommand
{
	public data: ApplicationCommandOptionData = {
		name: "dog",
		description: "Replies with a random picture of a Dog.",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		interaction.deferReply();

		fetch("https://random.dog/woof.json")
			.then((response) => response.json())
			.then((data: RandomDog) => interaction.followUp({ embeds: [
				new BotEmbed(client)
					.setTitle("Random Dog")
					.setDescription(`${client.user?.username} uses the [Random Dog API](https://random.dog/).`)
					.setImage(data.url)]
			}));
	}
}