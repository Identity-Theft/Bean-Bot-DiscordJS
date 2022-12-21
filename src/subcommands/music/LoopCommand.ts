import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { Subcommand } from "../../classes/Subcommand";
import { simpleEmbed2 } from "../../utils/Utils";

export default class LoopCommand extends Subcommand
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

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		client.musicManager.queues.get(interaction.guildId!)!.loop = args.getSubcommand() as "none" | "song" | "queue";
		interaction.reply({ embeds: [simpleEmbed2("Loop", `Now Looping: \`${args.getSubcommand()!}\``)] });
	}
}