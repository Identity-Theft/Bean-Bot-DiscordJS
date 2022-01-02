import { ApplicationCommandData, CommandInteraction, MessageEmbedOptions } from "discord.js";
import { RunFunction } from "../../interfaces/Command";
import Bot from "../../classes/Bot";

export const data: ApplicationCommandData = {
	name: "pause",
	description: "Pause or resume the current song.",
}

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.musicManager.canUseCommand(client, interaction) == false) return;

	const guildId = interaction.guildId!;

	const queue = client.musicManager.queues.get(guildId)!;
	const player = client.musicManager.audioPlayers.get(guildId)!;

	if (queue.paused == false) player.pause();
	else player.unpause();

	queue.paused = !queue.paused;

	const song = queue.songs[queue.playing];

	const embed: MessageEmbedOptions = {
		title: `Song ${queue.paused == true ? "Paused" : "Unpaused"}`,
		description: `[${song.title}](${song.url})`,
		thumbnail: {
			url: song.thumbnail
		},
		color: 'BLURPLE',
		footer: {
			text: `${queue.paused == true ? "Paused" : "Unpaused"} by ${interaction.user.tag}`,
			icon_url: interaction.user.avatarURL() as string | undefined
		}
	};

	interaction.reply({ embeds: [embed] });
}