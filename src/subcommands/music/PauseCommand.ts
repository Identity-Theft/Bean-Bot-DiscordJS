import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class PauseCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("pause")
		.setDescription("Pause or resume the current track.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void>
	{
		const guildId = interaction.guildId!;

		const queue = client.musicManager.queues.get(guildId)!;
		const player = queue.audioPlayer;

		if (queue.paused == false) player.pause();
		else player.unpause();

		queue.paused = !queue.paused;

		const track = queue.tracks[queue.currentTrack];

		const embed = new BotEmbed()
			.setTitle(`Track ${queue.paused == true ? "Paused" : "Unpaused"}`)
			.setDescription(`${track.formattedTitle}\n${queue.paused == true ? "Paused" : "Unpaused"} by ${interaction.user}`)
			.setThumbnail(track.thumbnail);

		interaction.reply({ embeds: [embed] });
	}
}