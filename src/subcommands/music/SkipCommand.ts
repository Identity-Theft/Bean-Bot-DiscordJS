import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class SkipCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("skip")
		.setDescription("Plays the next song in the queue.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction,): Promise<void>
	{
		if (await client.musicManager.canUseCommand(interaction, "") == false) return;

		const queue = client.musicManager.queues.get(interaction.guildId!)!;

		if (!queue.songs[queue.currentSong + 1])
		{
			const embed = new ErrorEmbed("There is no more songs in the queue.");
			interaction.reply({ embeds: [embed], ephemeral: true});
		}
		else
		{
			client.musicManager.audioPlayers.get(interaction.guildId!)?.stop();

			const embed = new BotEmbed(client)
				.setTitle("Song Skipped")
				.setDescription(`Song skipped by ${interaction.user}`);

			interaction.reply({ embeds: [embed] });
		}
	}
}