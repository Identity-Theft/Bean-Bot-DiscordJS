import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandIntegerOption, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class RemoveCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("remove")
		.setDescription("Remove asong from the queue.")
		.addIntegerOption(new SlashCommandIntegerOption()
			.setName("song")
			.setDescription("Song's position in the queue")
			.setRequired(true)
		)

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const guildId = interaction.guildId!;
		const queue = client.musicManager.queues.get(guildId)!;
		const position = args.getInteger("song")! - 1;

		if (queue.songs[position] == null)
		{
			const embed = new ErrorEmbed(`Song \`${position + 1}\` does not exist.`);
			interaction.reply({ embeds: [embed], ephemeral: true});
			return;
		}

		const song = queue.songs[position];

		const embed = new BotEmbed(client)
			.setTitle("Song Removed")
			.setDescription(`[${song.title}](${song.url})\nRemoved by ${interaction.user}`)
			.setThumbnail(song.thumbnail);

		interaction.reply({ embeds: [embed] });

		if (position == queue.currentSong)
		{
			queue.currentSong -= 1;
		client.musicManager.audioPlayers.get(guildId)!.stop();
		}
		else if (position < queue.currentSong)
			queue.currentSong -= 1;

		queue.songs.splice(position, 1);
	}
}