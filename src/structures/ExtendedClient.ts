import { ApplicationCommand, Client, Collection } from "discord.js";
import { ICommand, CommandCategory } from "./interfaces/ICommand";
import { Client as GeniusClient } from "genius-lyrics";
import IEvent from "./interfaces/IEvent";
import fs from "fs";
import dotenv from "dotenv";
import MusicManager from "./music/MusicManager";

dotenv.config();

export default class ExtendedClient extends Client
{
	public commands: Collection<string, ICommand> = new Collection();
	public events: Collection<string, IEvent> = new Collection();
	public musicManager: MusicManager;
	public geniusClient: GeniusClient;

	public constructor()
	{
		super({ intents: 647 });

		if (!process.env.BOT_TOKEN)
			throw new Error("'BOT_TOKEN' has not been set in the '.env' file.")

		if (!process.env.SPOTIFY_ID)
			throw new Error("'SPOTIFY_ID' has not been set in the '.env' file.")

		if (!process.env.SPOTIFY_SECRET)
			throw new Error("'SPOTIFY_SECRET' has not been set in the '.env' file.")

		if (!process.env.XRAPID)
			throw new Error("'XRAPID' has not been set in the '.env' file.")

		this.musicManager = new MusicManager();
		this.geniusClient = new GeniusClient();
	}

	public async start(): Promise<void>
	{
		this.login(process.env.TOKEN).catch(err => {
			console.log(err);
			return;
		});

		this.setup();
	}

	private async setup(): Promise<void>
	{
		// Add commands to collection
		const dir = `${__dirname}/../commands/`;
		const commandsFiles = fs.readdirSync(dir);

		commandsFiles.map(async (value: string) => {
			const commandFolder = fs.readdirSync(dir + value);
			commandFolder.map(async (file: string) => {
				const command: ICommand = new (await import(`${dir}${value}/${file}`)).default();
				this.commands.set(command.data.name, command);
			});
		});

		// Add events to collection
		const eventFiles = fs.readdirSync(`${__dirname}/../events/`);

		eventFiles.map(async (value: string) => {
			const eventFolder = fs.readdirSync(`${__dirname}/../events/${value}`);

			eventFolder.map(async (file: string) => {
				const event: IEvent = new (await import(`${__dirname}/../events/${value}/${file}`)).default();

				this.events.set(event.name, event);
				this.on(event.name, event.execute.bind(null, this));
			});
		});
	}

	public async createCommands(): Promise<void>
	{
		this.commands.forEach(async (command) => {
			if (command.category == CommandCategory.Deprecated)
			{
				const toRemove = (await this.application?.commands.fetch())?.filter(c => c.name == command.data.name).first();

				if (toRemove) this.application?.commands.delete(toRemove.id).then(() => console.log(`${command.data.name} deleted`));
			}
			else if (this.token == process.env.DEV || command.category != CommandCategory.Debug)
				this.application?.commands.create(command.data).then((registered: ApplicationCommand) => console.log(`${registered.name} registered`));
		});
	}
}
