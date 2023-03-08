import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../interfaces/ISubcommand";

export default class StopCommand implements ISubcommand
{
	public data: ApplicationCommandOptionData= {
		name: "stop",
		description: "Disconnet Bean Bot from the Voice Channel and clear the queue.",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		if (await client.musicManager.canUseCommand(interaction, "") == false) return;

		client.musicManager.disconnect(interaction.guildId!);

		const embed = new BotEmbed(client)
			.setTitle("Disconnected")
			.setDescription(`${client.user?.username} was disconnected by ${interaction.user}`);

		interaction.reply({ embeds: [embed] });
	}
}