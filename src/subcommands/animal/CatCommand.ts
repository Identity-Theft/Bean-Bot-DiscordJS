import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { RandomCat } from "../../structures/interfaces/RandomAnimal";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";

export default class CatCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("cat")
		.setDescription("Replies with a random picture of a Cat.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		interaction.deferReply();

		const data: RandomCat = await client.apiRequest("https://aws.random.cat/meow");

		interaction.followUp({ embeds: [
			new BotEmbed(client)
				.setTitle("Random Cat")
				.setDescription(`${client.user?.username} uses the [Random Cat API](https://aws.random.cat/).`)
				.setImage(data.file)]
		});
	}
}