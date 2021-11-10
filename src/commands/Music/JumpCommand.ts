import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";
import { errorEmbed, simpleEmbed2 } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: "jump",
	description: "Jump to song in the queue.",
	options: [
		{
			name: "song",
			description: "Song's position in the queue",
			type: "INTEGER",
			required: true
		}
	]
}

export const test = false;

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver) => {
	if (await client.musicManager.canUseCommand(client, interaction) == false) return;

	const guildId = interaction.guildId!;
	const queue = client.musicManager.getQueue(guildId)!;
	const position = args.getInteger("song")!;

	if (queue.songs[position - 1] == null)
	{
		const embed = errorEmbed(`Song \`${position}\` does not exist.`);
		interaction.reply({ embeds: [embed], ephemeral: true});
		return;
	}

	if (queue.playing == position - 1)
	{
		const embed = errorEmbed(`Song \`${position}\` is already playing.`);
		interaction.reply({ embeds: [embed], ephemeral: true});
		return;
	}

	queue.playing = position - 2;
	client.musicManager.getPlayer(guildId)?.stop();

	const embed = simpleEmbed2("Song Skipped", `Song skipped by ${interaction.user}`);
	interaction.reply({ embeds: [embed] });
}