import { RunFunction } from "../../interfaces/Event";

export const name = 'ready';

export const run: RunFunction = async(client): Promise<void> => {
	client.user?.setPresence({ activities: [{ name: 'Beans', type: 'WATCHING' }] });
	console.log(`${client.user?.tag} is now online!`);
	client.generateCommands();
}