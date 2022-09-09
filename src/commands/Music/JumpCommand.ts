import { ApplicationCommandData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { CommandFunction } from "../../interfaces/Command";
import { errorEmbed, simpleEmbed2 } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: "jump",
	description: "Jump to song in the queue.",
	options: [
		{
			name: "song",
			description: "Song's position in the queue",
			type: ApplicationCommandOptionType.Integer,
			required: true
		}
	]
}


export const run: CommandFunction = async (client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver) => {
	if (await client.musicManager.canUseCommand(interaction) == false) return;

	const guildId = interaction.guildId!;
	const queue = client.musicManager.queues.get(interaction.guildId!)!;
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
	client.musicManager.audioPlayers.get(guildId)?.stop();

	const embed = simpleEmbed2("Song Skipped", `Song skipped by ${interaction.user}`);
	interaction.reply({ embeds: [embed] });
}