import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, Collection } from "discord.js";
import fs from "fs";
import { CommandCategory, ICommand } from "../../interfaces/ICommand";
import ISubcommand from "../../interfaces/ISubcommand";
import ExtendedClient from "../../structures/ExtendedClient";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";

export default class AnimalCommand implements ICommand
{
	public data: ChatInputApplicationCommandData = {
		name: "random-animal",
		description: "Gets a random image of the selected animal.",
		options: []
	};

	public catergory: CommandCategory = CommandCategory.Fun;
	private subcommands: Collection<string, ISubcommand> = new Collection();

	public constructor()
	{
		const dir = `${__dirname}/../../subcommands/animal/`;
		const commandFiles = fs.readdirSync(dir);

		commandFiles.map(async (file: string) => {
			const command: ISubcommand = new (await import(dir + file)).default();

			this.subcommands.set(command.data.name, command);
			this.data.options?.push(command.data);
		});
	}

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const subcommand = args.getSubcommandGroup() || args.getSubcommand();

		const command = this.subcommands.get(subcommand);

		if (!command) {
			interaction.reply({ embeds: [new ErrorEmbed("XD")] });
			return;
		}

		command.execute(client, interaction, args);
	}
}