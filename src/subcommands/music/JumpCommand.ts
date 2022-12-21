import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { Subcommand } from "../../classes/Subcommand";
import { errorEmbed, simpleEmbed2 } from "../../utils/Utils";

export default class JumpCommand extends Subcommand
{
	public data: ApplicationCommandOptionData = {
		name: "jump",
		description: "Jump to song in the queue.",
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

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const guildId = interaction.guildId!;
		const queue = client.musicManager.queues.get(interaction.guildId!)!;
		const position = args.getInteger("song")!;

		if (queue.songs[position - 1] == null)
		{
			const embed = errorEmbed(`Song \`${position}\` does not exist.`);
			interaction.reply({ embeds: [embed], ephemeral: true});
			return;
		}

		if (queue.playing == position - 1)
		{
			const embed = errorEmbed(`Song \`${position}\` is already playing.`);
			interaction.reply({ embeds: [embed], ephemeral: true});
			return;
		}

		queue.skipped = true;
		queue.playing = position - 2;
		client.musicManager.audioPlayers.get(guildId)?.stop();

		const embed = simpleEmbed2("Song Skipped", `Song skipped by ${interaction.user}`);
		interaction.reply({ embeds: [embed] });
	}
}