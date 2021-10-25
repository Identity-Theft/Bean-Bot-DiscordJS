import { Client, Collection } from "discord.js";
import { Command } from '../interfaces/Command';
import { Event } from "../interfaces/Event";
import glob from 'glob';
import dotenv from 'dotenv';
import { promisify } from 'util';
import BotMusicManger from "./BotMusicManager";
dotenv.config();

const globPromise = promisify(glob);

class Bot extends Client {
	public commands: Collection<string, Command> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public botMusicManager = new BotMusicManger();

	public constructor() {
		super({ intents: 643 });
	}

	public async start(): Promise<void> {
		this.login(process.env.TOKEN);

		const ext = __filename.split(".")[1];

		// Add commands to collection
		const commandFiles: string[] = await globPromise(`${__dirname}/../commands/**/*.${ext}`);

		commandFiles.map(async (value: string) => {
			const file: Command = await import(value);
			this.commands.set(file.data.name, file);
		});

		// Add events to collection
		const eventFiles: string[] = await globPromise(`${__dirname}/../events/**/*.${ext}`);

		eventFiles.map(async (value: string) => {
			const file: Event = await import(value);
			this.events.set(file.name, file);

			// Bind event
			this.on(file.name, file.run.bind(null, this));
		});
	}

	public async generateCommands(): Promise<void> {
		this.commands.forEach((file) => {
			if (file.test == true) {
				this.application?.commands.create(file.data, '844081963324407848');
			}
			else {
				this.application?.commands.create(file.data);
			}
		});
	}
}

export default Bot;