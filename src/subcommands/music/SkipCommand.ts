import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { Subcommand } from "../../classes/Subcommand";
import { errorEmbed, simpleEmbed2 } from "../../utils/Utils";

export default class SkipCommand extends Subcommand
{
	public data: ApplicationCommandOptionData = {
		name: "skip",
		description: "Plays the next song in the queue.",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		if (await client.musicManager.canUseCommand(interaction, "") == false) return;

		const queue = client.musicManager.queues.get(interaction.guildId!)!;

		if (!queue.songs[queue.playing + 1])
		{
			const embed = errorEmbed("There is no more songs in the queue.");
			interaction.reply({ embeds: [embed], ephemeral: true});
		}
		else
		{
			client.musicManager.audioPlayers.get(interaction.guildId!)?.stop();

			const embed = simpleEmbed2("Song Skipped", `Song skipped by ${interaction.user}`);
			interaction.reply({ embeds: [embed] });
		}
	}
}