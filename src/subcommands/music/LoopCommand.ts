import { CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, TrackEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { QueueLoopMode } from "../../structures/music/Queue";

export default class LoopCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("loop")
		.setDescription("Loop the current track or the queue.")
		.addStringOption(new SlashCommandStringOption()
			.setName("mode")
			.setDescription("Loop mode.")
			.addChoices({ name: "none", value: "none" }, { name: "track", value: "track" }, { name: "queue", value: "queue"})
			.setRequired(true)
		);

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const option = args.getString("mode") as 'none' | 'track' | 'queue';
		const queue = client.musicManager.queues.get(interaction.guildId!)!;
		const track = queue.tracks[queue.currentTrack];

		let embed: EmbedBuilder;

		switch (option) {
			case "none":
				queue.loopMode = QueueLoopMode.None;
				embed = new BotEmbed().setDescription(`No longed looping`);
				break;
			case "track":
				queue.loopMode = QueueLoopMode.Track;
				embed = new TrackEmbed(`Now Looping ${track.formattedTitle}`, track.platform);
				break;
			case "queue":
				queue.loopMode = QueueLoopMode.Queue;
				embed = new BotEmbed().setDescription(`Now Looping the queue`);
				break;
		}

		interaction.reply({ embeds: [embed] });
	}
}