import { ApplicationCommand, Client, Collection } from "discord.js";
import { ICommand, CommandCategory } from "../interfaces/ICommand";
import IEvent from "../interfaces/IEvent";
import fs from "fs";
import dotenv from "dotenv";
import MusicManager from "./MusicManager";
dotenv.config();

export default class ExtendedClient extends Client
{
	public commands: Collection<string, ICommand> = new Collection();
	public events: Collection<string, IEvent> = new Collection();
	public musicManager = new MusicManager();

	public constructor()
	{
		super({ intents: 647 });
	}

	public start(): void
	{
		this.login(process.env.DEV).catch(err => {
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
			if (command.catergory == CommandCategory.Deprecated)
			{
				const toRemove = (await this.application?.commands.fetch())?.filter(c => c.name == command.data.name).first();

				if (toRemove) this.application?.commands.delete(toRemove.id).then(() => console.log(`${command.data.name} deleted`));
			}
			else if (this.token == process.env.DEV)
				this.application?.commands.create(command.data, "844081963324407848").then((registered: ApplicationCommand) => console.log(`${registered.name} registered`));
			else if (command.catergory != CommandCategory.Debug)
				this.application?.commands.create(command.data).then((registered: ApplicationCommand) => console.log(`${registered.name} registered`));
		});
	}
}
