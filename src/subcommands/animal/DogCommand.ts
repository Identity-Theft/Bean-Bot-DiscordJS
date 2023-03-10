import { ApplicationCommandOptionData, CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import ISubcommand from "../../interfaces/ISubcommand";
import { RandomDog } from "../../structures/data/RandomAnimal";
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

		const data: RandomDog = await client.apiRequest("https://random.dog/woof.json");

		interaction.followUp({ embeds: [
			new BotEmbed(client)
				.setTitle("Random Cat")
				.setDescription(`${client.user?.username} uses the [Random Dog API](https://random.dog/).`)
				.setImage(data.url)]
		});
	}
}