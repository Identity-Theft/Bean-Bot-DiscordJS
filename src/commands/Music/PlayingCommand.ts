import { ApplicationCommandData, CommandInteraction, MessageEmbedOptions } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";

export const data: ApplicationCommandData = {
	name: 'playing',
	description: 'Get info about the current song.',
	options: []
}
export const test = false;

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction) => {
	if (await client.musicManager.canUseCommand(client, interaction) == false) return;
	const queue = client.musicManager.getQueue(interaction.guildId!)!;
	const song = queue.songs[queue.playing];

	const embed: MessageEmbedOptions = {
		title: "Currently Playing",
		description: `[${song.title}](${song.url})`,
		thumbnail: {
			url: song.thumbnail
		},
		fields: [
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
		],
		color: 'BLURPLE',
		footer: {
			text: `Added by ${song.addedBy.tag}`,
			icon_url: song.addedBy.avatarURL() as string | undefined
		}
	};

	interaction.reply({ embeds: [embed] });
}