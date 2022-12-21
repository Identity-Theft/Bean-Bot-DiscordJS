import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { Subcommand } from "../../classes/Subcommand";

export default class QueueCommand extends Subcommand
{
	public data: ApplicationCommandOptionData= {
		name: "queue",
		description: "Replies with all the songs in to the queue",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const queue = client.musicManager.queues.get(interaction.guildId!)!;

		queue.generateQueueEmbed(interaction);
	}
}