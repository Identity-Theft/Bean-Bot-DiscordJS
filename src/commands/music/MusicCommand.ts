import { CommandInteraction, CommandInteractionOptionResolver, Collection, ChatInputApplicationCommandData } from "discord.js";
import fs from "fs";
import ExtendedClient from "../../structures/ExtendedClient";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { CommandCategory, ICommand } from "../../interfaces/ICommand";
import ISubcommand from "../../interfaces/ISubcommand";

export default class MusicCommand implements ICommand
{
	public data: ChatInputApplicationCommandData = {
		name: "music",
		description: "Play music in vc",
		options: []
	}

	public catergory = CommandCategory.Music;

	private subcommands: Collection<string, ISubcommand> = new Collection();

	public constructor()
	{
		const dir = `${__dirname}/../../subcommands/music/`;
		const commandFiles = fs.readdirSync(dir);

		commandFiles.map(async (file: string) => {
			const command: ISubcommand = new (await import(dir + file)).default();

			this.subcommands.set(command.data.name, command);
			this.data.options?.push(command.data);
		});
	}

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const subcommand = args.getSubcommandGroup() || args.getSubcommand();

		if (!await client.musicManager.canUseCommand(interaction, subcommand)) return;

		const command = this.subcommands.get(subcommand);

		if (!command) {
			interaction.reply({ embeds: [new ErrorEmbed("XD")] });
			return;
		}

		command.execute(client, interaction, args);
	}
}