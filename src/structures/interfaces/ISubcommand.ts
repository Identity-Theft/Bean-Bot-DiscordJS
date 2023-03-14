import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import ExtendedClient from "../ExtendedClient";

export default interface ISubcommand
{
	data: SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder;
	execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
}