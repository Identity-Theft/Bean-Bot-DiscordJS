import Bot from "./Bot";
import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";

export enum CommandCategory {
	Debug = 1,
	General = 2,
	Music = 3,
	Info = 4,
	Deprecated = 5
}

export abstract class Command
{
	abstract data: ChatInputApplicationCommandData;
	abstract catergory: CommandCategory;
	abstract execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>;
}