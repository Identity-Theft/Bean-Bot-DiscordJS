import { ActivityType } from "discord.js";
import Bot from "../../classes/Bot";
import IEvent from "../../interfaces/Event";

export default class ReadyEvent implements IEvent
{
	public name = "ready";

	public async run(client: Bot): Promise<void>
	{
		client.user?.setPresence({ activities: [{ name: "Beans", type: ActivityType.Competing }] });
		console.log(`${client.user?.tag} is now online!`);
		client.generateCommands();
	}
}