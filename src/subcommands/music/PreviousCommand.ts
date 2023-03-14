import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class PreviousCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("previous")
		.setDescription("Play the previous song in the queue.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		const queue = client.musicManager.queues.get(interaction.guildId!)!;

		if (!queue.songs[queue.currentSong - 1])
		{
			const embed = new ErrorEmbed("There is no previous song.");
			interaction.reply({ embeds: [embed], ephemeral: true});
		}
		else
		{
			queue.currentSong -= 2;
			client.musicManager.audioPlayers.get(interaction.guildId!)?.stop();

			const embed = new BotEmbed(client)
				.setTitle("Song Skipped")
				.setDescription(`Song skipped by ${interaction.user}`);
			interaction.reply({ embeds: [embed] });
		}
	}
}