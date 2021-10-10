import { ButtonInteraction, Interaction, MessageActionRow, MessageButton } from "discord.js";
import { RunFunction } from "../../interfaces/Event";
import { embed, errorEmbed } from "../../utils/Utils";

export const name: string = 'interactionCreate';

export const run: RunFunction = async(client, interaction: Interaction): Promise<void> => {
    if (interaction.isCommand()) {
        const { commandName, options } = interaction;
        const args: Map<string, any> = new Map();

        if (options) {
            for (const option of options.data) {
                const { name: optionName, value, options: subOptions } = option;
                if (value) args.set(optionName, value);

                if (subOptions) {
                    for (const subOption of subOptions) {
                        const { name: subName, value: subValue } = subOption;
                        args.set(subName, subValue);
                    }
                }

                if (!subOptions && !value) args.set('option', optionName);
            }
        }

        const cmd = client.commands.get(commandName);

        if (!cmd) {
            interaction.reply({ embeds: [errorEmbed(`Command \`/${commandName}\` could not be loaded, please try again later.`)], ephemeral: true });
            return;
        }

        cmd.run(client, interaction, args);
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

