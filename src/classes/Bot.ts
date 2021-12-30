import { Client, Collection } from "discord.js";
import { Command } from "../interfaces/Command";
import { Event } from "../interfaces/Event";
// import glob from "glob";
import fs from "fs";
import dotenv from "dotenv";
// import { promisify } from "util";
import MusicManager from "./MusicManager";
dotenv.config();

// const globPromise = promisify(glob);

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
		this.login(process.env.TOKEN);
		// this.login(process.env.DEV);

		// this.setup()
		this.herokuSetup();
	}

	// private async setup(): Promise<void>
	// {
	// 	const ext = __filename.split(".")[1];

	// 	// Add commands to collection
	// 	const commandFiles: string[] = await globPromise(`${__dirname}/../commands/**/*.${ext}`);

	// 	commandFiles.map(async (value: string) => {
	// 		const file: Command = await import(value);
	// 		this.commands.set(file.data.name, file);
	// 	});

	// 	// Add events to collection
	// 	const eventFiles: string[] = await globPromise(`${__dirname}/../events/**/*.${ext}`);

	// 	eventFiles.map(async (value: string) => {
	// 		const file: Event = await import(value);
	// 		this.events.set(file.name, file);

	// 		// Bind event
	// 		this.on(file.name, file.run.bind(null, this));
	// 	});
	// }

	private async herokuSetup(): Promise<void>
	{
		// Add commands to collection
		const commandsFiles: string [] = await fs.readdirSync(`${__dirname}/../commands/`);

		commandsFiles.map(async (value: string) => {
			const commandFoler: string[] = await fs.readdirSync(`${__dirname}/../commands/${value}`);

			commandFoler.map(async (file: string) => {
				const commandFile: Command = await import(`${__dirname}/../commands/${value}/${file}`);

				this.commands.set(commandFile.data.name, commandFile);
			});
		});

		// Add events to collection
		const eventFiles: string [] = await fs.readdirSync(`${__dirname}/../events/`);

		eventFiles.map(async (value: string) => {
			const eventFoler: string[] = await fs.readdirSync(`${__dirname}/../events/${value}`);

			eventFoler.map(async (file: string) => {
				const eventFile: Event = await import(`${__dirname}/../events/${value}/${file}`);

				this.events.set(eventFile.name, eventFile);
				this.on(eventFile.name, eventFile.run.bind(null, this));
			});
		});
	}

	public async generateCommands(): Promise<void>
	{
		this.commands.forEach((file) => {
			if (file.test == true || this.token == process.env.DEV) this.application?.commands.create(file.data, '844081963324407848');
			else this.application?.commands.create(file.data);
		});
	}
}
