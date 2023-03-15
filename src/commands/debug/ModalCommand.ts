import { CacheType, Collection, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js"
import ExtendedClient from "../../structures/ExtendedClient";
import fs from "fs";
import { ICommand, CommandCategory } from "../../structures/interfaces/ICommand";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";

export default class ModalCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("modal")
		.setDescription("modal deez nuts");

	public category: CommandCategory = CommandCategory.Debug;

	private subcommands: Collection<string, ISubcommand> = new Collection();

	public constructor()
	{
		const dir = `${__dirname}/../../subcommands/debug/`;
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

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver<CacheType>): Promise<void>
	{
		const subcommand = args.getSubcommandGroup() || args.getSubcommand();

		const command = this.subcommands.get(subcommand);

		if (!command)
		{
			interaction.reply({ embeds: [new ErrorEmbed("XD")] });
			return;
		}

		command.execute(client, interaction, args);
	}
}