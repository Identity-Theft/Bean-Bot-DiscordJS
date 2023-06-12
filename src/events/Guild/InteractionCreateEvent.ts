import { ClientEvents, CommandInteractionOptionResolver, Interaction } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { CommandCategory } from "../../structures/interfaces/ICommand";
import IEvent from "../../structures/interfaces/IEvent";

export default class InteractionCreateEvent implements IEvent
{
	public name: keyof ClientEvents = "interactionCreate";

	public async execute(client: ExtendedClient, interaction: Interaction): Promise<void>
	{
		if (interaction.isChatInputCommand())
		{
			if (!interaction.inGuild())
			{
				interaction.reply({ embeds: [new ErrorEmbed("Bean Bot must be used in a server.")], ephemeral: true });
				return;
			}

			const { commandName, options } = interaction;

			const cmd = client.commands.get(commandName);

			if (!cmd)
			{
				interaction.reply({ embeds: [new ErrorEmbed(`Command \`/${commandName}\` doesn't exist or couldn't be loaded.`)], ephemeral: true });
				return;
			}

			if (cmd.category == CommandCategory.Deprecated)
			{
				interaction.reply({ embeds: [new ErrorEmbed(`Command \`/${commandName}\` is depracted and will be replaced.`)], ephemeral: true });
				return;
			}

			cmd.execute(client, interaction, options as CommandInteractionOptionResolver);
		}
	}
}