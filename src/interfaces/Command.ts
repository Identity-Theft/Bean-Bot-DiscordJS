import Bot from "../classes/Bot";
import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";

export interface RunFunction {
	(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
}

export interface Command {
	data: ApplicationCommandData;
	test: boolean;
	run: RunFunction;
}