import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../interfaces/ISubcommand";

export default class PauseCommand implements ISubcommand
{
	public data: ApplicationCommandOptionData = {
		name: "pause",
		description: "Pause or resume the current song.",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		const guildId = interaction.guildId!;

		const queue = client.musicManager.queues.get(guildId)!;
		const player = client.musicManager.audioPlayers.get(guildId)!;

		if (queue.paused == false) player.pause();
		else player.unpause();

		queue.paused = !queue.paused;

		const song = queue.songs[queue.currentSong];

		const embed = new BotEmbed(client)
			.setTitle(`Song ${queue.paused == true ? "Paused" : "Unpaused"}`)
			.setDescription(`[${song.title}](${song.url})\n${queue.paused == true ? "Paused" : "Unpaused"} by ${interaction.user}`)
			.setThumbnail(song.thumbnail);

		interaction.reply({ embeds: [embed] });
	}
}