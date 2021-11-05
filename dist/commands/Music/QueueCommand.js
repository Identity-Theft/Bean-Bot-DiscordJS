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
const Utils_1 = require("../../utils/Utils");
exports.data = {
    name: 'queue',
    description: 'Replies with all the songs in to the queue',
};
exports.test = false;
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield client.botMusicManager.canUseCommand(client, interaction)) == false)
        return;
    const queue = client.botMusicManager.getQueue(interaction.guildId);
    if (queue != undefined) {
        interaction.reply('```\n' + queue.songs.map((song, index) => `${index + 1}. ${song.title} (${song.platform})${queue.playing != index ? '' : ' - Currently Playing'}`).join('\n') + '```');
    }
    else {
        interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('There is no queue')], ephemeral: true });
    }
});
exports.run = run;
