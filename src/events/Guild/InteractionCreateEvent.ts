import { CommandInteractionOptionResolver, Interaction } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { CommandCategory } from "../../structures/interfaces/ICommand";
import IEvent from "../../structures/interfaces/IEvent";

export default class InteractionCreateEvent implements IEvent
{
	public name = "interactionCreate";

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

			if (cmd.catergory == CommandCategory.Deprecated)
			{
				interaction.reply({ embeds: [new ErrorEmbed(`Command \`/${commandName}\` is depracted and will be replaced.`)], ephemeral: true });
				return;
			}

			cmd.execute(client, interaction, options as CommandInteractionOptionResolver);
		}
		else if (interaction.isButton())
		{
			if (interaction.message.author.id != client.user?.id) return;

			const queue = client.musicManager.queues.get(interaction.guildId!);

			switch(interaction.customId)
			{
				case "ButtonTest1":
					interaction.update({ embeds: [new BotEmbed(client).setDescription("Beans")] });
					break;
				case "FirstPage":
					if (queue == undefined) return;

					queue?.changePage(0, interaction);
					break;
				case "PrevPage":
					if (queue == undefined) return;

					queue?.changePage(queue.currentPage - 1, interaction);
					break;
				case "NextPage":
					if (queue == undefined) return;

					queue?.changePage(queue.currentPage + 1, interaction);
					break;
				case "LastPage":
					if (queue == undefined) return;

					queue?.changePage(queue.embedPages.length - 1, interaction);
					break;
			}
		}
		else if (interaction.isChannelSelectMenu())
		{
			if (interaction.message.author.id != client.user?.id) return;

			if (interaction.user.id != interaction.message.interaction?.user.id)
			{
				interaction.reply({ content: "Only the user who created the select menu can respond.", ephemeral: true });
				return;
			}

			// Bot has no select menus yet
		}
		else if (interaction.isRoleSelectMenu())
		{
			if (interaction.message.author.id != client.user?.id) return;

			switch (interaction.customId)
			{
				case "self-roles":
					(await interaction.guild?.members.fetch(interaction.user.id))?.roles.add(interaction.roles.map(r => r.id));
					interaction.reply({ content: `Successfully added ${interaction.roles.size} role`, ephemeral: true });
					break;
			}

		}
	}
}