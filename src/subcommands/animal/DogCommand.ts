import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import {RandomDog} from "../../structures/interfaces/RandomAnimal";
import ExtendedClient from "../../structures/ExtendedClient";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { apiRequest } from "../../utils/Utils";

export default class CatCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("dog")
		.setDescription("Replies with a random picture of a dog");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		await interaction.deferReply();

		const data: RandomDog = (await apiRequest("https://api.thedogapi.com/v1/images/search"))[0];

		if (!data.url)
		{
			await interaction.followUp({ embeds: [new ErrorEmbed("Unknown error occurred")]});
			return;
		}

		await interaction.followUp({ content: data.url });
	}
}