import { ApplicationCommandData, CommandInteraction, EmbedBuilder } from "discord.js";
import { CommandFunction } from "../../interfaces/Command";
import Bot from "../../classes/Bot";

export const data: ApplicationCommandData = {
	name: "pause",
	description: "Pause or resume the current song.",
}

export const run: CommandFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.musicManager.canUseCommand(interaction) == false) return;

	const guildId = interaction.guildId!;

	const queue = client.musicManager.queues.get(guildId)!;
	const player = client.musicManager.audioPlayers.get(guildId)!;

	if (queue.paused == false) player.pause();
	else player.unpause();

	queue.paused = !queue.paused;

	const song = queue.songs[queue.playing];

	const embed = new EmbedBuilder()
		.setTitle(`Song ${queue.paused == true ? "Paused" : "Unpaused"}`)
		.setDescription(`[${song.title}](${song.url})`)
		.setThumbnail(song.thumbnail)
		.setColor("Blurple")
		.setFooter({
			text: `${queue.paused == true ? "Paused" : "Unpaused"} by ${interaction.user.tag}`,
			iconURL: interaction.user.avatarURL() as string | undefined
		})

	interaction.reply({ embeds: [embed] });
}