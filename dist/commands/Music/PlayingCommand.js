"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.test = exports.data = void 0;
const discord_js_1 = require("discord.js");
exports.data = {
    name: 'playing',
    description: 'Get info about the current song.',
    options: []
};
exports.test = false;
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield client.musicManager.canUseCommand(client, interaction)) == false)
        return;
    const queue = client.musicManager.getQueue(interaction.guildId);
    const song = queue.songs[queue.playing];
    const embed = new discord_js_1.MessageEmbed()
        .setTitle("Currently Playing")
        .setDescription(`[${song.title}](${song.url})`)
        .setThumbnail(song.thumbnail)
        .addFields({ name: "Duration", value: song.fortmatedDuration, inline: true }, { name: "Likes", value: song.likes.toString(), inline: true }, { name: "Views", value: song.views, inline: true })
        .setFooter(`Added by ${song.addedBy.tag}`, song.addedBy.avatarURL())
        .setColor('BLURPLE');
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
