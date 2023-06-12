import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandIntegerOption, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class RemoveCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("remove")
		.setDescription("Remove a track from the queue.")
		.addIntegerOption(new SlashCommandIntegerOption()
			.setName("track")
			.setDescription("Track's position in the queue")
			.setRequired(true)
		)

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const guildId = interaction.guildId!;
		const queue = client.musicManager.queues.get(guildId)!;
		const position = args.getInteger("track")! - 1;

		if (!queue.tracks[position])
		{
			const embed = new ErrorEmbed(`Track \`${position + 1}\` does not exist.`);
			interaction.reply({ embeds: [embed], ephemeral: true});
			return;
		}

		queue.currentTrack -= 1;

		if (position == queue.currentTrack) queue.audioPlayer.stop();

		const removed = queue.tracks.splice(position, 1);

		for (let i = 0; i < removed.length; i++) {
			const track = removed[i];
			track.clearLyricsEmbeds();
		}

		const track = queue.tracks[position];
		const embed = new BotEmbed().setDescription(`Removed track ${track.formattedTitle}`)

		interaction.reply({ embeds: [embed] });
	}
}