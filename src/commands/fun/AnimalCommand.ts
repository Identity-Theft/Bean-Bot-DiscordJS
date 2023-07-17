import { CommandInteraction, CommandInteractionOptionResolver, Collection, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import fs from "fs";
import { CommandCategory, ICommand } from "../../structures/interfaces/ICommand";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import ExtendedClient from "../../structures/ExtendedClient";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";

export default class AnimalCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("random-animal")
		.setDescription("Gets a random image of the selected animal.");

	public category = CommandCategory.Fun;
	private subcommands: Collection<string, ISubcommand> = new Collection();

	public constructor()
	{
		const dir = `${__dirname}/../../subcommands/animal/`;
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

		const command = this.subcommands.get(subcommand);

		if (!command) {
			await interaction.reply({ embeds: [new ErrorEmbed(`Command \`/${subcommand}\` doesn't exist or couldn't be loaded.`)], ephemeral: true });
			return;
		}

		await command.execute(client, interaction, args);
	}
}