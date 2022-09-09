import { ApplicationCommandData, CommandInteraction } from "discord.js";
import Bot from "../../classes/Bot";
import { CommandFunction } from "../../interfaces/Command";
import { errorEmbed, simpleEmbed2 } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: "next",
	description: "Play the next song in the queue."
}


export const run: CommandFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.musicManager.canUseCommand(interaction) == false) return;

	const queue = client.musicManager.queues.get(interaction.guildId!)!;

	if (!queue.songs[queue.playing + 1])
	{
		const embed = errorEmbed("There is no more songs in the queue.");
		interaction.reply({ embeds: [embed], ephemeral: true});
	}
	else
	{
		client.musicManager.audioPlayers.get(interaction.guildId!)?.stop();

		const embed = simpleEmbed2("Song Skipped", `Song skipped by ${interaction.user}`);
		interaction.reply({ embeds: [embed] });
	}
}