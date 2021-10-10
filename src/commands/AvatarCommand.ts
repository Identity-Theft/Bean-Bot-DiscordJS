import { Snowflake, MessageEmbed, ApplicationCommandData, CommandInteraction } from "discord.js";
import { Bot } from "../client/Client";
import { RunFunction } from "../interfaces/Command";

export const data: ApplicationCommandData = {
    name: 'avatar',
    description: 'Replies with a user\'s avatar.',
    options:[
        {
            type: 'USER',
            name: 'user',
            description: 'User to get avatar from.',
            required: true,
        }
    ],
}
export const test: boolean = true;

export const run: RunFunction = async(client: Bot, interaction: CommandInteraction, args: Map<string, any>) => {
    const userId:Snowflake = args.get('user');
    const guild = interaction.guild!;
    const user = (await guild.members.fetch(userId)).user;

    const embed = new MessageEmbed()
        .setTitle(`${user.tag}`)
        .setImage(`${user.avatarURL()}`)
        .setColor('BLURPLE')

    interaction.reply({ embeds: [embed] });
}