import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { ErrorEmbed, BotEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class SkipCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("next")
		.setDescription("Plays the next track in the queue.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction,): Promise<void>
	{
		const guildId = interaction.guildId!;
		const queue = client.musicManager.queues.get(guildId)!;

		queue.jumpTrack(queue.currentTrack + 1, interaction);
	}
}