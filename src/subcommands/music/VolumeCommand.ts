import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandIntegerOption, SlashCommandSubcommandBuilder } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";

export default class VolumeCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandBuilder()
		.setName("volume")
		.setDescription("Set the volume")
		.addIntegerOption(new SlashCommandIntegerOption()
			.setName("percentage")
			.setDescription("Volume percentage")
			.setRequired(true)
		);

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const volume = args.getInteger("percentage")!;

		if (volume < 1)
		{
			await interaction.reply({ embeds: [new ErrorEmbed("Volume must be at least 1")]});
			return;
		}

		if (volume > 100)
		{
			await interaction.reply({ embeds: [new ErrorEmbed("Volume cannot be higher than 100")]});
			return;
		}


		const queue = client.musicManager.queues.get(interaction.guildId!)!;
		queue.setVolume(volume / 100);

		const embed = new BotEmbed().setDescription(`Volume has been set to \`${volume}%\``);
		await interaction.reply({ embeds: [embed] });
	}
}