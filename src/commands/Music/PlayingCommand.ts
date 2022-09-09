import { ApplicationCommandData, CommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "../../classes/Bot";
import { CommandFunction } from "../../interfaces/Command";

export const data: ApplicationCommandData = {
	name: "playing",
	description: "Get info about the current song.",
	options: []
}

export const run: CommandFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.musicManager.canUseCommand(interaction) == false) return;
	const queue = client.musicManager.queues.get(interaction.guildId!)!;
	const song = queue.songs[queue.playing];

	const embed = new EmbedBuilder()
		.setTitle("Currently Playing")
		.setDescription(`${queue.paused == true ? "(Paused)" : ""} [${song.title}](${song.url})`)
		.setThumbnail(song.thumbnail)
		.setFields([
			{
				name: "Duration",
				value: song.fortmatedDuration,
				inline: true
			},
			{
				name: "Likes",
				value: song.likes.toString(),
				inline: true
			},
			{
				name: "Views",
				value: song.views,
				inline: true
			}
		])
		.setColor("Blurple")
		.setFooter({
			text: `Added by ${song.addedBy.tag}`,
			iconURL: song.addedBy.avatarURL() as string | undefined
		});

	interaction.reply({ embeds: [embed] });
}