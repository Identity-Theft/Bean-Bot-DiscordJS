import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, MessageEmbedOptions } from "discord.js";
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


export const run: RunFunction = async (client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	if (await client.musicManager.canUseCommand(client, interaction) == false) return;

	const guildId = interaction.guildId!;
	const queue = client.musicManager.queues.get(guildId)!;
	const position = options.getInteger("song")! - 1;

	if (queue.songs[position] == null)
	{
		const embed = errorEmbed(`Song \`${position + 1}\` does not exist.`);
		interaction.reply({ embeds: [embed], ephemeral: true});
		return;
	}

	const song = queue.songs[position];

	const embed: MessageEmbedOptions = {
		title: "Song Removed",
		description: `[${song.title}](${song.url})`,
		thumbnail: {
			url: song.thumbnail
		},
		color: 'BLURPLE',
		footer: {
			text: `Removed by ${interaction.user.tag}`,
			icon_url: interaction.user.avatarURL() as string | undefined
		}
	};

	interaction.reply({ embeds: [embed] });

	if (position == queue.playing)
	{
		queue.playing -= 1;
		client.musicManager.audioPlayers.get(guildId)!.stop();
	}
	else if (position < queue.playing)
		queue.playing -= 1;

	queue.songs.splice(position, 1);
}