import { ApplicationCommandData, CommandInteraction } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";
import { errorEmbed, simpleEmbed2 } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: "previous",
	description: "Play the previous song in the queue."
}

export const test = false;

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.musicManager.canUseCommand(client, interaction) == false) return;

	const queue = client.musicManager.getQueue(interaction.guildId!)!;

	if (!queue.songs[queue.playing - 1])
	{
		const embed = errorEmbed("There is no previous song.");
		interaction.reply({ embeds: [embed], ephemeral: true});
	}
	else
	{
		queue.playing -= 2;
		client.musicManager.getPlayer(interaction.guildId!)?.stop();

		const embed = simpleEmbed2("Song Skipped", `Song skipped by ${interaction.user}`);
		interaction.reply({ embeds: [embed] });
	}
}