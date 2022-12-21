import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { Subcommand } from "../../classes/Subcommand";
import { errorEmbed, simpleEmbed2 } from "../../utils/Utils";

export default class PreviousCommand extends Subcommand
{
	public data: ApplicationCommandOptionData = {
		name: "previous",
		description: "Play the previous song in the queue.",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const queue = client.musicManager.queues.get(interaction.guildId!)!;

		if (!queue.songs[queue.playing - 1])
		{
			const embed = errorEmbed("There is no previous song.");
			interaction.reply({ embeds: [embed], ephemeral: true});
		}
		else
		{
			queue.playing -= 2;
			client.musicManager.audioPlayers.get(interaction.guildId!)?.stop();

			const embed = simpleEmbed2("Song Skipped", `Song skipped by ${interaction.user}`);
			interaction.reply({ embeds: [embed] });
		}
	}
}