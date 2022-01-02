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
exports.data = {
    name: 'playing',
    description: 'Get info about the current song.',
    options: []
};
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield client.musicManager.canUseCommand(client, interaction)) == false)
        return;
    const queue = client.musicManager.queues.get(interaction.guildId);
    const song = queue.songs[queue.playing];
    const embed = {
        title: "Currently Playing",
        description: `${queue.paused == true ? "(Paused)" : ""} [${song.title}](${song.url})`,
        thumbnail: {
            url: song.thumbnail
        },
        fields: [
            {
                name: "Duration",
                value: song.fortmatedDuration,
                inline: true
            },
            {
                name: "Likes",
                value: song.likes.toString(),
                inline: true
            },
            {
                name: "Views",
                value: song.views,
                inline: true
            }
        ],
        color: 'BLURPLE',
        footer: {
            text: `Added by ${song.addedBy.tag}`,
            icon_url: song.addedBy.avatarURL()
        }
    };
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
