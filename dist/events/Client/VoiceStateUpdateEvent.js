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
exports.run = exports.name = void 0;
const voice_1 = require("@discordjs/voice");
const Utils_1 = require("../../utils/Utils");
const VoiceUtils_1 = require("../../utils/VoiceUtils");
exports.name = 'voiceStateUpdate';
const run = (client, oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const queue = client.musicManager.getQueue(oldState.guild.id);
    if (((_a = oldState.member) === null || _a === void 0 ? void 0 : _a.user) == client.user) {
        if (queue != undefined && oldState.channelId != null && oldState.channel != null && newState.channel != queue.voiceChannel) {
            (0, voice_1.joinVoiceChannel)({ channelId: oldState.channelId, guildId: oldState.guild.id, adapterCreator: (0, VoiceUtils_1.createDiscordJSAdapter)(oldState.channel) });
        }
    }
    else {
        if (queue != undefined && oldState.channel == queue.voiceChannel && ((_b = oldState.channel) === null || _b === void 0 ? void 0 : _b.members.size) == 1) {
            const embed = (0, Utils_1.simpleEmbed2)("Disconnected", `Bean Bot left ${queue.voiceChannel} because no one else was in the Voice Channel.`);
            queue.textChannel.send({ embeds: [embed] });
            client.musicManager.disconnect(oldState.guild.id);
        }
    }
});
exports.run = run;
