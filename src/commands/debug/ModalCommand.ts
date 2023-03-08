import { CacheType, ChatInputApplicationCommandData, Collection, CommandInteraction, CommandInteractionOptionResolver } from "discord.js"
import ExtendedClient from "../../structures/ExtendedClient";
import fs from "fs";
import { ICommand, CommandCategory } from "../../interfaces/ICommand";
import ISubcommand from "../../interfaces/ISubcommand";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";

export default class ModalCommand implements ICommand
{
	public data: ChatInputApplicationCommandData = {
		name: "modal",
		description: "modal deez nuts",
		options: []
	};

	public catergory: CommandCategory = CommandCategory.Debug;

	private subcommands: Collection<string, ISubcommand> = new Collection();

	public constructor()
	{
		const dir = `${__dirname}/../../subcommands/debug/`;
		const commandFiles = fs.readdirSync(dir);

		commandFiles.map(async (file: string) => {
			const command: ISubcommand = new (await import(dir + file)).default();

			this.subcommands.set(command.data.name, command);
			this.data.options?.push(command.data);
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