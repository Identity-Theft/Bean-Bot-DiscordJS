import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class QueueCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("queue")
		.setDescription("Replies with all the songs in to the queue");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		const queue = client.musicManager.queues.get(interaction.guildId!)!;

		queue.generateQueueEmbed(client, interaction);
	}
}