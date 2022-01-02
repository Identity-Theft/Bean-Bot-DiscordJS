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
    name: "pause",
    description: "Pause or resume the current song.",
};
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield client.musicManager.canUseCommand(client, interaction)) == false)
        return;
    const guildId = interaction.guildId;
    const queue = client.musicManager.queues.get(guildId);
    const player = client.musicManager.audioPlayers.get(guildId);
    if (queue.paused == false)
        player.pause();
    else
        player.unpause();
    queue.paused = !queue.paused;
    const song = queue.songs[queue.playing];
    const embed = {
        title: `Song ${queue.paused == true ? "Paused" : "Unpaused"}`,
        description: `[${song.title}](${song.url})`,
        thumbnail: {
            url: song.thumbnail
        },
        color: 'BLURPLE',
        footer: {
            text: `${queue.paused == true ? "Paused" : "Unpaused"} by ${interaction.user.tag}`,
            icon_url: interaction.user.avatarURL()
        }
    };
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
