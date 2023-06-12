import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { RandomCat } from "../../structures/interfaces/RandomAnimal";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { apiRequest } from "../../utils/Utils";

export default class CatCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("cat")
		.setDescription("Replies with a random picture of a Cat.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		interaction.deferReply();

		const data: RandomCat = await apiRequest("https://aws.random.cat/meow");

		if (data == null)
		{
			interaction.followUp({ embeds: [new ErrorEmbed("Unkown error occured")]});
			return;
		}

		interaction.followUp({ embeds: [
			new BotEmbed()
				.setAuthor({ name: "Random Cat" })
				.setDescription(`${client.user?.username} uses the [Random Cat API](https://aws.random.cat/).`)
				.setImage(data.file)
			]
		});
	}
}