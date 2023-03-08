import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../interfaces/ISubcommand";

export default class PlayingCommand implements ISubcommand
{
	public data: ApplicationCommandOptionData = {
		name: "playing",
		description: "Get info about the current song.",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void>
	{
		const queue = client.musicManager.queues.get(interaction.guildId!)!;
		const song = queue.songs[queue.currentSong];

		const embed = new BotEmbed(client)
			.setTitle("Currently Playing")
			.setDescription(`${queue.paused ? "(Paused)" : ""} [${song.title}](${song.url})\nAdded by ${song.addedBy}`)
			.setThumbnail(song.thumbnail);

		interaction.reply({ embeds: [embed] });
	}
}