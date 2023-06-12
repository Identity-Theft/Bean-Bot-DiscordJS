import { ClientEvents } from "discord.js";
import ExtendedClient from "../ExtendedClient";

export default interface IEvent
{
	name: keyof ClientEvents;
	execute(client: ExtendedClient, ...args: any[]): Promise<void>;
}