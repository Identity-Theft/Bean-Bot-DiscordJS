import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class LoopCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandGroupBuilder()
		.setName("loop")
		.setDescription("Loop the current song or the queue.")
		.addSubcommand(new SlashCommandSubcommandBuilder()
			.setName("none")
			.setDescription("Do not loop.")
		)
		.addSubcommand(new SlashCommandSubcommandBuilder()
			.setName("song")
			.setDescription("Loop the current song.")
		)
		.addSubcommand(new SlashCommandSubcommandBuilder()
			.setName("queue")
			.setDescription("Loop the queue.")
		);

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const queue = client.musicManager.queues.get(interaction.guildId!)!;
		const song = queue.songs[queue.currentSong];

		queue.loop = args.getSubcommand() as "none" | "song" | "queue";

		const embed = new BotEmbed(client)
			.setDescription(`Now Looping ${args.getSubcommand() == "song" ? `(${song.title})[${song.url}]` : queue.loop}`)

		interaction.reply({ embeds: [embed] });
	}
}