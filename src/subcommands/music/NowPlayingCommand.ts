import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { TrackEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class PlayingCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("nowplaying")
		.setDescription("Get info about the current track.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void>
	{
		const queue = client.musicManager.queues.get(interaction.guildId!)!;
		const track = queue.tracks[queue.currentTrack];

		const embed = new TrackEmbed("Now Playing", track.platform)
			.addFields([
				{
					name: "Playing",
					value: track.formattedTitle,
				},
				{
					name: "Track Length",
					value: track.duration,
					inline: true
				},
				{
					name: "Position in Queue",
					value: `${queue!.tracks.length}`,
					inline: true
				},
			])
			.setThumbnail(track.thumbnail);

		await interaction.reply({ embeds: [embed] });
	}
}