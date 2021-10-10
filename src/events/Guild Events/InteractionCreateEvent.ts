import { Interaction } from "discord.js";
import { RunFunction } from "../../interfaces/Event";
import { embed, errorEmbed } from "../../utils/Utils";

export const name = 'interactionCreate';

export const run: RunFunction = async(client, interaction: Interaction): Promise<void> => {
	if (interaction.isCommand()) {
		const { commandName, options } = interaction;

		const cmd = client.commands.get(commandName);

		if (!cmd) {
			interaction.reply({ embeds: [errorEmbed(`Command \`/${commandName}\` doesn't exist or couldn't be loaded.`)], ephemeral: true });
			return;
		}

		cmd.run(client, interaction, options);
	}

	if (interaction.isButton()) {
		// interaction.channel?.send('button moment');
		switch(interaction.customId){
		case 'ButtonTest1':
			interaction.update({ embeds: [embed(client, 'Beans')] });
			break;
		}
	}
}

