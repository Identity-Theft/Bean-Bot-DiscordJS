import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import ISubcommand from "../../interfaces/ISubcommand";

export default class LoopCommand implements ISubcommand
{
	public data: ApplicationCommandOptionData = {
		name: "loop",
		description: "Loop the current song or the queue.",
		type: ApplicationCommandOptionType.SubcommandGroup,
		options: [
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "none",
				description: "Do not loop."
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "song",
				description: "Loop the current song."
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "queue",
				description: "Loop the queue."
			}
		]
	};

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