import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder } from "discord.js";
import Bot from "../../classes/Bot";
import { Subcommand } from "../../classes/Subcommand";

export default class PlayingCommand extends Subcommand
{
	public data: ApplicationCommandOptionData = {
		name: "playing",
		description: "Get info about the current song.",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const queue = client.musicManager.queues.get(interaction.guildId!)!;
		const song = queue.songs[queue.playing];

		const embed = new EmbedBuilder()
			.setTitle("Currently Playing")
			.setDescription(`${queue.paused ? "(Paused)" : ""} [${song.title}](${song.url})`)
			.setThumbnail(song.thumbnail)
			.setColor("Blurple")
			.setFooter({
				text: `Added by ${song.addedBy.tag}`,
				iconURL: song.addedBy.avatarURL() as string | undefined
			});

		interaction.reply({ embeds: [embed] });
	}
}