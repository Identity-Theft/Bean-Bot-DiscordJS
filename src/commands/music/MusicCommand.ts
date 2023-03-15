import { CommandInteraction, CommandInteractionOptionResolver, Collection, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import fs from "fs";
import ExtendedClient from "../../structures/ExtendedClient";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { CommandCategory, ICommand } from "../../structures/interfaces/ICommand";
import ISubcommand from "../../structures/interfaces/ISubcommand";

export default class MusicCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("music")
		.setDescription("Play music in vc");

	public category = CommandCategory.Music;

	private subcommands: Collection<string, ISubcommand> = new Collection();

	public constructor()
	{
		const dir = `${__dirname}/../../subcommands/music/`;
		const commandFiles = fs.readdirSync(dir);

		commandFiles.map(async (file: string) => {
			const command: ISubcommand = new (await import(dir + file)).default();

			this.subcommands.set(command.data.name, command);

			if (command.data instanceof SlashCommandSubcommandBuilder)
				this.data.addSubcommand(command.data);
			else
				this.data.addSubcommandGroup(command.data);
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