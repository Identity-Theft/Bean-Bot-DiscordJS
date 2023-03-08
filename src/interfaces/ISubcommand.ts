import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import ExtendedClient from "../structures/ExtendedClient";

export default interface ISubcommand
{
	data: ApplicationCommandOptionData;
	execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
}