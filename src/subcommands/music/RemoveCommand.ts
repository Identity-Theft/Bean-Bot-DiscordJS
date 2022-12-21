import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder } from "discord.js";
import Bot from "../../classes/Bot";
import { Subcommand } from "../../classes/Subcommand";
import { errorEmbed } from "../../utils/Utils";

export default class RemoveCommand extends Subcommand
{
	public data: ApplicationCommandOptionData= {
		name: "remove",
		description: "Remove asong from the queue.",
		type: ApplicationCommandOptionType.Subcommand,
		options: [
			{
				name: "song",
				description: "Song's position in the queue",
				type: ApplicationCommandOptionType.Integer,
				required: true
			}
		]
	};

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const guildId = interaction.guildId!;
		const queue = client.musicManager.queues.get(guildId)!;
		const position = args.getInteger("song")! - 1;

		if (queue.songs[position] == null)
		{
			const embed = errorEmbed(`Song \`${position + 1}\` does not exist.`);
			interaction.reply({ embeds: [embed], ephemeral: true});
			return;
		}

		const song = queue.songs[position];

		const embed = new EmbedBuilder()
			.setTitle("Song Removed")
			.setDescription(`[${song.title}](${song.url})`)
			.setThumbnail(song.thumbnail)
			.setColor("Blurple")
			.setFooter({
				text: `Removed by ${interaction.user.tag}`,
				iconURL: interaction.user.avatarURL() as string | undefined
			});

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
}