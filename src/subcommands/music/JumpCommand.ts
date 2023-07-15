import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandIntegerOption, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class JumpCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("jump")
		.setDescription("Jump to a track in the queue.")
		.addIntegerOption(new SlashCommandIntegerOption()
			.setName("track")
			.setDescription("Track's position in the queue")
			.setRequired(true)
		);

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const queue = client.musicManager.queues.get(interaction.guildId!)!;
		const position = args.getInteger("track")!;

		queue.jumpTrack(position - 1, interaction);
	}
}