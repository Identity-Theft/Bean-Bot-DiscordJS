import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../interfaces/ISubcommand";

export default class JumpCommand implements ISubcommand
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

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const guildId = interaction.guildId!;
		const queue = client.musicManager.queues.get(interaction.guildId!)!;
		const position = args.getInteger("song")!;

		if (queue.songs[position - 1] == null)
		{
			const embed = new ErrorEmbed(`Song \`${position}\` does not exist.`);
			interaction.reply({ embeds: [embed], ephemeral: true});
			return;
		}

		if (queue.currentSong == position - 1)
		{
			const embed = new ErrorEmbed(`Song \`${position}\` is already playing.`);
			interaction.reply({ embeds: [embed], ephemeral: true});
			return;
		}

		queue.skipped = true;
		queue.currentSong = position - 2;
		client.musicManager.audioPlayers.get(guildId)?.stop();

		const embed = new BotEmbed(client)
			.setTitle("Song Skipped")
			.setDescription(`Song skipped by ${interaction.user}`);
		interaction.reply({ embeds: [embed] });
	}
}