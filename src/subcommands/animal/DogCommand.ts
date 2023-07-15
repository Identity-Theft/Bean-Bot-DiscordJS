import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { RandomDog } from "../../structures/interfaces/RandomAnimal";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { apiRequest } from "../../utils/Utils";

export default class DogCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("dog")
		.setDescription("Replies with a random picture of a Dog.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		interaction.deferReply();

		const data: RandomDog = await apiRequest("https://random.dog/woof.json");

		if (!data.url)
		{
			interaction.followUp({ embeds: [new ErrorEmbed("Unkown error occured")]});
			return;
		}

		interaction.followUp({ embeds: [
			new BotEmbed()
				.setAuthor({ name: "Random Dog" })
				.setDescription(`${client.user?.username} uses the [Random Dog API](https://random.dog/).`)
				.setImage(data.url)
		]});
	}
}