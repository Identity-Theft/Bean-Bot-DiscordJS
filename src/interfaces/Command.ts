import { Bot } from "../client/Client";
import { ApplicationCommandData, CommandInteraction } from "discord.js";

export interface RunFunction {
    (client: Bot, interaction: CommandInteraction, args: Map<string, any>): Promise<void>
};

export interface Command {
    data: ApplicationCommandData;
    test: boolean;
    run: RunFunction;
}