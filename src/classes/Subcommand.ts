import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Bot from "./Bot";

export abstract class Subcommand
{
	public abstract data: ApplicationCommandOptionData;
	public abstract execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
}