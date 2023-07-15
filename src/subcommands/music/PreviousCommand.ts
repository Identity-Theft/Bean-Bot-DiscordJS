import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class PreviousCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("previous")
		.setDescription("Play the previous track in the queue.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		const queue = client.musicManager.queues.get(interaction.guildId!)!;

		queue.jumpTrack(queue.currentTrack - 1, interaction);
	}
}