import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class LyricsCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("lyrics")
		.setDescription("Find lyrics for the current song.");

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void>
	{
		const track = client.musicManager.queues.get(interaction.guildId!)!.getCurrentTrack();
		track.getLyrics(client, interaction);
	}
}