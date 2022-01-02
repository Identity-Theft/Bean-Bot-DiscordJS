import { CommandInteractionOptionResolver, Interaction } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Event";
import { simpleEmbed, errorEmbed, getChannel } from "../../utils/Utils";

export const name = 'interactionCreate';

export const run: RunFunction = async(client: Bot, interaction: Interaction): Promise<void> => {
	if (interaction.isCommand())
	{
		const { commandName, options } = interaction;

		const c = await getChannel(client, interaction.guildId!, interaction.channelId)!;

		if (!c?.includes("bot"))
		{
			interaction.reply({ embeds: [errorEmbed('Bean Bot must be used in a bot channel.')], ephemeral: true });
			return;
		}

		const cmd = client.commands.get(commandName);

		if (!cmd)
		{
			interaction.reply({ embeds: [errorEmbed(`Command \`/${commandName}\` doesn't exist or couldn't be loaded.`)], ephemeral: true });
			return;
		}

		cmd.run(client, interaction, options as CommandInteractionOptionResolver);
	}

	if (interaction.isButton())
	{
		const queue = client.musicManager.queues.get(interaction.guildId!);

		switch(interaction.customId)
		{
		case 'ButtonTest1':
			interaction.update({ embeds: [simpleEmbed(client, 'Beans')] });
			break;
		case 'FirstPage':
			if (queue == undefined) return;

			queue?.changePage(0, interaction);
			break;
		case 'PrevPage':
			if (queue == undefined) return;

			queue?.changePage(queue.currentPage - 1, interaction);
			break;
		case 'NextPage':
			if (queue == undefined) return;

			queue?.changePage(queue.currentPage + 1, interaction);
			break;
		case 'LastPage':
			if (queue == undefined) return;

			queue?.changePage(queue.embedPages.length - 1, interaction);
			break;
		}
	}
}

