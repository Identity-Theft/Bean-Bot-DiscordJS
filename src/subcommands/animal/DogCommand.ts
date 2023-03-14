import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { RandomDog } from "../../structures/interfaces/RandomAnimal";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";

export default class DogCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("dog")
		.setDescription("Replies with a random picture of a Dog.");

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