import { ActivityType } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import IEvent from "../../interfaces/IEvent";

export default class ReadyEvent implements IEvent
{
	public name = "ready";

	public async execute(client: ExtendedClient): Promise<void>
	{
		client.user?.setPresence({ activities: [{ name: "Beans", type: ActivityType.Competing }] });
		console.log(`${client.user?.tag} is now online!`);
		client.createCommands();
	}
}