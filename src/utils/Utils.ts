import { MessageEmbed } from "discord.js";
import { Bot } from "../client/Client";

function embed(client: Bot,description: string): MessageEmbed {
    return new MessageEmbed()
        .setAuthor(client.user?.username!, client.user?.avatarURL()!)
        .setDescription(description)
        .setColor('BLURPLE')
}

function errorEmbed(err: string): MessageEmbed {
    return new MessageEmbed()
        .setTitle('Error')
        .setDescription(err)
        .setColor('RED')
    }

export { embed, errorEmbed };