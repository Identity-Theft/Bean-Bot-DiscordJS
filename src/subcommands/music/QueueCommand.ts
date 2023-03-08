import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../interfaces/ISubcommand";

export default class QueueCommand implements ISubcommand
{
	public data: ApplicationCommandOptionData= {
		name: "queue",
		description: "Replies with all the songs in to the queue",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		const queue = client.musicManager.queues.get(interaction.guildId!)!;

		queue.generateQueueEmbed(client, interaction);
	}
}