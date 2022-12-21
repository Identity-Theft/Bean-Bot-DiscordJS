import { ApplicationCommand, Client, Collection } from "discord.js";
import { Command, CommandCategory } from "./Command";
import Event from "../interfaces/Event";
import fs from "fs";
import dotenv from "dotenv";
import MusicManager from "./MusicManager";
dotenv.config();

export default class Bot extends Client
{
	public commands: Collection<string, Command> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public musicManager = new MusicManager();

	public constructor()
	{
		super({ intents: 647 });
	}

	public start(): void
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
			commandFolder.map(async (file: string) => this.readCommandFile(`${dir}${value}/${file}`));
		});

		// Add events to collection
		const eventFiles = fs.readdirSync(`${__dirname}/../events/`);

		eventFiles.map(async (value: string) => {
			const eventFolder = fs.readdirSync(`${__dirname}/../events/${value}`);

			eventFolder.map(async (file: string) => {
				const eventFile = (await import(`${__dirname}/../events/${value}/${file}`)).default;
				const event: Event = new eventFile;

				this.events.set(event.name, event);
				this.on(event.name, event.run.bind(null, this));
			});
		});
	}

	private async readCommandFile(file: string): Promise<void>
	{
		const command: Command = new (await import(file)).default();

		console.log(`Loading ${command.data.name}`);

		this.commands.set(command.data.name, command);
	}

	public async generateCommands(): Promise<void>
	{
		this.commands.forEach(async (command) => {
			if (this.token == process.env.DEV && command.catergory != CommandCategory.Deprecated) this.application?.commands.create(command.data, "844081963324407848").then((registered: ApplicationCommand) => console.log(`${registered.name} registered`));
			else if (command.catergory != CommandCategory.Debug && command.catergory != CommandCategory.Deprecated) this.application?.commands.create(command.data).then((registered: ApplicationCommand) => console.log(`${registered.name} registered`));
			else if (command.catergory == CommandCategory.Deprecated)
			{
				const toRemove = (await this.application?.commands.fetch())?.filter(c => c.name == command.data.name).first();

				if (toRemove) this.application?.commands.delete(toRemove.id).then(() => console.log(`${command.data.name} deleted`));
			}
		});
	}
}
