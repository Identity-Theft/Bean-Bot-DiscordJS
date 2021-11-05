import { ApplicationCommandData, CommandInteraction } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";
import { errorEmbed } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: 'queue',
	description: 'Replies with all the songs in to the queue',
}
export const test = false;

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.botMusicManager.canUseCommand(client, interaction) == false) return;
	const queue = client.botMusicManager.getQueue(interaction.guildId!);

	if (queue != undefined) {
		interaction.reply('```\n' + queue.songs.map((song, index) =>
			`${index + 1}. ${song.title} (${song.platform})${queue.playing != index ? '' : ' - Currently Playing'}`,
		).join('\n') + '```');
	}
	else {
		interaction.reply({ embeds: [errorEmbed('There is no queue')], ephemeral: true });
	}
}