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
const Utils_1 = require("../../utils/Utils");
exports.data = {
    name: "remove",
    description: "Remove asong from the queue.",
    options: [
        {
            name: "song",
            description: "Song's position in the queue",
            type: "INTEGER",
            required: true
        }
    ]
};
exports.test = false;
const run = (client, interaction, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((yield client.musicManager.canUseCommand(client, interaction)) == false)
        return;
    const guildId = interaction.guildId;
    const queue = client.musicManager.getQueue(guildId);
    const position = options.getInteger("song") - 1;
    if (queue.songs[position] == null) {
        const embed = (0, Utils_1.errorEmbed)(`Song \`${position}\` does not exist.`);
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }
    const song = queue.songs[position];
    const embed = new discord_js_1.MessageEmbed()
        .setTitle("Song Removed")
        .setDescription(`[${song.title}](${song.url})`)
        .setThumbnail(song.thumbnail)
        .setFooter(`Removed by ${interaction.user.tag}`)
        .setColor('BLURPLE');
    interaction.reply({ embeds: [embed] });
    if (position == queue.playing) {
        queue.playing -= 1;
        (_a = client.musicManager.getPlayer(interaction.guildId)) === null || _a === void 0 ? void 0 : _a.stop();
    }
    else if (position < queue.playing)
        queue.playing -= 1;
    queue.songs.splice(position, 1);
});
exports.run = run;
