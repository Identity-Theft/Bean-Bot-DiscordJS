import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { BotEmbed } from "../../structures/ExtendedEmbeds";

export default class StopCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("stop")
		.setDescription("Disconnet Bean Bot from the Voice Channel and clear the queue.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void>
	{
		client.musicManager.queues.get(interaction.guildId!)?.destroy();

		const embed = new BotEmbed().setDescription(`The queue has been cleared`);

		await interaction.reply({ embeds: [embed] });
	}
}