import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { RandomCat } from "../../structures/interfaces/RandomAnimal";
import ExtendedClient from "../../structures/ExtendedClient";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { apiRequest } from "../../utils/Utils";

export default class CatCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("cat")
		.setDescription("Replies with a random picture of a cat");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		await interaction.deferReply();

		const data: RandomCat = (await apiRequest("https://api.thecatapi.com/v1/images/search"))[0];

		if (!data.url)
		{
			await interaction.followUp({ embeds: [new ErrorEmbed("Unknown error occurred")]});
			return;
		}

		await interaction.followUp({ content: data.url });
	}
}