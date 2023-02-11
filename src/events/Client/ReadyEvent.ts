import { ActivityType } from "discord.js";
import Bot from "../../classes/Bot";
import Event from "../../interfaces/Event";

export default class ReadyEvent extends Event
{
	public name = "ready";

	public async execute(client: Bot): Promise<void>
	{
		client.user?.setPresence({ activities: [{ name: "Beans", type: ActivityType.Competing }] });
		console.log(`${client.user?.tag} is now online!`);
		client.createCommands();
	}
}