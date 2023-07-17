import ExtendedClient from "../ExtendedClient";
import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export enum CommandCategory {
	Debug,
	General,
	Music,
	Info,
	Deprecated,
	Fun
}

export interface ICommand
{
	data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;
	category: CommandCategory;
	execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>;
}