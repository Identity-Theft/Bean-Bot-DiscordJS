import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder } from "discord.js";
import { Subcommand } from "../../classes/Subcommand";
import Bot from "../../classes/Bot";

export default class PauseCommand extends Subcommand
{
	public data: ApplicationCommandOptionData = {
		name: "pause",
		description: "Pause or resume the current song.",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
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
}