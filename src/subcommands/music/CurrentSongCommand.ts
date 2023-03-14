import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class PlayingCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("current-song")
		.setDescription("Get info about the current song.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void>
	{
		const queue = client.musicManager.queues.get(interaction.guildId!)!;
		const song = queue.songs[queue.currentSong];

		const embed = new BotEmbed(client)
			.setTitle("Currently Playing")
			.setDescription(`${queue.paused ? "(Paused)" : ""} [${song.title}](${song.url})\nPosition in Queue: ${queue.currentSong + 1}/${queue.songs.length}\nAdded by ${song.addedBy}`)
			.setThumbnail(song.thumbnail);

		interaction.reply({ embeds: [embed] });
	}
}