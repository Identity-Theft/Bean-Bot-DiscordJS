import { Client, Collection } from "discord.js";
import { Command } from "../interfaces/Command";
import IEvent from "../interfaces/Event";
import fs from "fs";
import dotenv from "dotenv";
import MusicManager from "./MusicManager";
dotenv.config();

export default class Bot extends Client
{
	public commands: Collection<string, Command> = new Collection();
	public events: Collection<string, IEvent> = new Collection();
	public musicManager = new MusicManager();

	public constructor()
	{
		super({ intents: 647 });
	}

	public start(): void
	{
		// this.login(process.env.TOKEN);
		this.login(process.env.DEV);

		this.setup();
	}

	private async setup(): Promise<void>
	{
		// Add commands to collection
		const commandsFiles = fs.readdirSync(`${__dirname}/../commands/`);

		commandsFiles.map(async (value: string) => {
			const commandFolder = fs.readdirSync(`${__dirname}/../commands/${value}`);

			commandFolder.map(async (file: string) => {
				const commandFile: Command = await import(`${__dirname}/../commands/${value}/${file}`);

				this.commands.set(commandFile.data.name, commandFile);
			});
		});

		// Add events to collection
		const eventFiles = fs.readdirSync(`${__dirname}/../events/`);

		eventFiles.map(async (value: string) => {
			const eventFolder = fs.readdirSync(`${__dirname}/../events/${value}`);

			eventFolder.map(async (file: string) => {
				const eventFile = (await import(`${__dirname}/../events/${value}/${file}`)).default;
				const event: IEvent = new eventFile;

				this.events.set(event.name, event);
				this.on(event.name, event.run.bind(null, this));
			});
		});
	}

	public async generateCommands(): Promise<void>
	{
		this.commands.forEach((cmd) => {
			if (this.token == process.env.DEV) this.application?.commands.create(cmd.data, "844081963324407848");
			else this.application?.commands.create(cmd.data);
		});
	}
}
