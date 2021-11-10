import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, MessageEmbed } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";
import { errorEmbed } from "../../utils/Utils";

export const data: ApplicationCommandData = {
	name: "remove",
	description: "Remove asong from the queue.",
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

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	if (await client.musicManager.canUseCommand(client, interaction) == false) return;

	const guildId = interaction.guildId!;
	const queue = client.musicManager.getQueue(guildId)!;
	const position = options.getInteger("song")! - 1;

	if (queue.songs[position] == null)
	{
		const embed = errorEmbed(`Song \`${position}\` does not exist.`);
		interaction.reply({ embeds: [embed], ephemeral: true});
		return;
	}

	const song = queue.songs[position];

	const embed = new MessageEmbed()
		.setTitle("Song Removed")
		.setDescription(`[${song.title}](${song.url})`)
		.setThumbnail(song.thumbnail)
		.setFooter(`Removed by ${interaction.user.tag}`)
		.setColor('BLURPLE');

	interaction.reply({ embeds: [embed] });

	if (position == queue.playing)
	{
		queue.playing -= 1;
		client.musicManager.getPlayer(interaction.guildId!)?.stop();
	}
	else if (position < queue.playing)
		queue.playing -= 1;

	queue.songs.splice(position, 1);
}