import ExtendedClient from "../structures/ExtendedClient";
import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";

export enum CommandCategory {
	Debug = 1,
	General = 2,
	Music = 3,
	Info = 4,
	Deprecated = 5,
	Fun = 6
}

export interface ICommand
{
	data: ChatInputApplicationCommandData;
	catergory: CommandCategory;
	execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>;
}