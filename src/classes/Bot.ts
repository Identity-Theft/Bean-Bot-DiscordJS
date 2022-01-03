import { ApplicationCommandPermissionData, Client, Collection } from "discord.js";
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

	public activities: Collection<string, string> = new Collection([
		["youtube", '880218394199220334'], // Note : First package to include the new YouTube Together version, any other package offering it will be clearly inspired by it
		["youtubedev", '880218832743055411'], // Note : First package to include the new YouTube Together development version, any other package offering it will be clearly inspired by it
		["poker", '755827207812677713'],
		["pokerdev", '763133495793942528'],
		["betrayal", '773336526917861400'],
		["fishing", '814288819477020702'],
		["chess", '832012774040141894'],
		["chessdev", '832012586023256104'], // Note : First package to offer chessDev, any other package offering it will be clearly inspired by it
		["lettertile", '879863686565621790'], // Note : First package to offer lettertile, any other package offering it will be clearly inspired by it
		["wordsnack", '879863976006127627'], // Note : First package to offer wordsnack any other package offering it will be clearly inspired by it
		["doodlecrew", '878067389634314250'], // Note : First package to offer doodlecrew, any other package offering it will be clearly inspired by it
		["awkword", '879863881349087252'], // Note : First package to offer awkword, any other package offering it will be clearly inspired by it
		["spellcast", '852509694341283871'], // Note : First package to offer spellcast, any other package offering it will be clearly inspired by it
		["checkers", '832013003968348200'], // Note : First package to offer checkers, any other package offering it will be clearly inspired by it
		["sketchyartist", '879864070101172255'] // Note : First package to offer sketchyartist, any other package offering it will be clearly inspired by it
	])

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
		const commandsFiles = fs.readdirSync(`${__dirname}/../commands/`);

		commandsFiles.map(async (value: string) => {
			const commandFoler = fs.readdirSync(`${__dirname}/../commands/${value}`);

			commandFoler.map(async (file: string) => {
				const commandFile: Command = await import(`${__dirname}/../commands/${value}/${file}`);

				this.commands.set(commandFile.data.name, commandFile);
			});
		});

		// Add events to collection
		const eventFiles = fs.readdirSync(`${__dirname}/../events/`);

		eventFiles.map(async (value: string) => {
			const eventFoler = fs.readdirSync(`${__dirname}/../events/${value}`);

			eventFoler.map(async (file: string) => {
				const eventFile: Event = await import(`${__dirname}/../events/${value}/${file}`);

				this.events.set(eventFile.name, eventFile);
				this.on(eventFile.name, eventFile.run.bind(null, this));
			});
		});
	}

	public async generateCommands(): Promise<void>
	{
		this.commands.forEach((cmd) => {
			if (this.token == process.env.DEV) this.application?.commands.create(cmd.data, '844081963324407848');
			else if (cmd.data.name == "activity")
			{
				this.application?.commands.create(cmd.data, "905958361995022356").then(async command => {
					command.setDefaultPermission(false);

					const c = await command.guild?.commands.fetch(command.id);

					const permissions: ApplicationCommandPermissionData[] = [
						{
							id: "905958714782134303",
							type: "ROLE",
							permission: true
						}
					]

					c?.permissions.set({ permissions });
				});
			}
			else this.application?.commands.create(cmd.data);
		});
	}
}
