import { CommandInteraction, CacheType, CommandInteractionOptionResolver, Collection, ChatInputApplicationCommandData } from "discord.js";
import fs from "fs";
import Bot from "../../classes/Bot";
import { Subcommand } from "../../classes/Subcommand";
import { CommandCategory, Command } from "../../classes/Command";
import { errorEmbed } from "../../utils/Utils";

export default class MusicCommand extends Command
{
	public data: ChatInputApplicationCommandData = {
		name: "music",
		description: "Play music in vc",
		options: []
	}

	public catergory = CommandCategory.Music;

	private subcommands: Collection<string, Subcommand> = new Collection();

	public constructor()
	{
		super();

		const dir = `${__dirname}/../../subcommands/music/`;
		const commandFiles = fs.readdirSync(dir);

		commandFiles.map(async (file: string) => {
			if (!file.endsWith(".ts")) return;

			const commandFile = (await import(dir + file)).default;

			if (commandFile !instanceof Subcommand) return;

			const command: Subcommand = new commandFile();

			this.subcommands.set(command.data.name, command);
			this.data.options?.push(command.data);
		});
	}

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver<CacheType>): Promise<void> {
		const subcommand = args.getSubcommandGroup() || args.getSubcommand();

		if (!await client.musicManager.canUseCommand(interaction, subcommand)) return;

		const command = this.subcommands.get(subcommand);

		if (!command) {
			interaction.reply({ embeds: [errorEmbed("XD")] });
			return;
		}

		command.execute(client, interaction, args);
	}
}