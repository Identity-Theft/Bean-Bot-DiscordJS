import { ApplicationCommandData, CommandInteraction } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";
import { errorEmbed, simpleEmbed2 } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: "next",
	description: "Play the next song in the queue"
}

export const test = true;

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.botMusicManager.canUseCommand(client, interaction) == false) return;

	const queue = client.botMusicManager.getQueue(interaction.guildId!)!;

	if (!queue.songs[queue.playing + 1])
	{
		const embed = errorEmbed("There is no more songs in the queue.");
		interaction.reply({ embeds: [embed], ephemeral: true});
	}
	else
	{
		client.botMusicManager.getPlayer(interaction.guildId!)?.stop();

		const embed = simpleEmbed2("Song Skipped", `Song skipped by ${interaction.user}`);
		interaction.reply({ embeds: [embed] });
	}
}