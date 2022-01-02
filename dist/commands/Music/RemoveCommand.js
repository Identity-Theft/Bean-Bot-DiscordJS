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
exports.run = exports.data = void 0;
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
const run = (client, interaction, options) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield client.musicManager.canUseCommand(client, interaction)) == false)
        return;
    const guildId = interaction.guildId;
    const queue = client.musicManager.queues.get(guildId);
    const position = options.getInteger("song") - 1;
    if (queue.songs[position] == null) {
        const embed = (0, Utils_1.errorEmbed)(`Song \`${position + 1}\` does not exist.`);
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }
    const song = queue.songs[position];
    const embed = {
        title: "Song Removed",
        description: `[${song.title}](${song.url})`,
        thumbnail: {
            url: song.thumbnail
        },
        color: 'BLURPLE',
        footer: {
            text: `Removed by ${interaction.user.tag}`,
            icon_url: interaction.user.avatarURL()
        }
    };
    interaction.reply({ embeds: [embed] });
    if (position == queue.playing) {
        queue.playing -= 1;
        client.musicManager.audioPlayers.get(guildId).stop();
    }
    else if (position < queue.playing)
        queue.playing -= 1;
    queue.songs.splice(position, 1);
});
exports.run = run;
