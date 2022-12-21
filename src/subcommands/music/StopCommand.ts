import { ApplicationCommandOptionData, ApplicationCommandOptionType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "../../classes/Bot";
import { Subcommand } from "../../classes/Subcommand";
import { simpleEmbed2 } from "../../utils/Utils";

export default class StopCommand extends Subcommand
{
	public data: ApplicationCommandOptionData= {
		name: "stop",
		description: "Disconnet Bean Bot from the Voice Channel and clear the queue.",
		type: ApplicationCommandOptionType.Subcommand
	};

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		if (await client.musicManager.canUseCommand(interaction, "") == false) return;

		client.musicManager.disconnect(interaction.guildId!);

		const embed = simpleEmbed2("Disconnected", `${client.user?.username} was disconnected by ${interaction.user}`);
		interaction.reply({ embeds: [embed] });
	}
}