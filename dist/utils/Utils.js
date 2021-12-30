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
exports.formatDuration = exports.getChannel = exports.errorEmbed = exports.simpleEmbed2 = exports.simpleEmbed = void 0;
const discord_js_1 = require("discord.js");
function simpleEmbed(client, description) {
    var _a, _b;
    const embed = {
        author: {
            name: (_a = client.user) === null || _a === void 0 ? void 0 : _a.username,
            icon_url: (_b = client.user) === null || _b === void 0 ? void 0 : _b.avatarURL()
        },
        description: description,
        color: 'BLURPLE'
    };
    return new discord_js_1.MessageEmbed(embed);
}
exports.simpleEmbed = simpleEmbed;
function simpleEmbed2(name, description) {
    const embed = {
        title: name,
        description: description,
        color: 'BLURPLE'
    };
    return new discord_js_1.MessageEmbed(embed);
}
exports.simpleEmbed2 = simpleEmbed2;
function errorEmbed(err) {
    const embed = {
        title: "⚠️ Error",
        description: err,
        color: 'RED'
    };
    return new discord_js_1.MessageEmbed(embed);
}
exports.errorEmbed = errorEmbed;
function getChannel(client, guildId, channelId) {
    return __awaiter(this, void 0, void 0, function* () {
        const guild = yield client.guilds.fetch(guildId);
        const channel = yield guild.channels.cache.find(c => c.id == channelId);
        return channel === null || channel === void 0 ? void 0 : channel.name;
    });
}
exports.getChannel = getChannel;
const formatInt = (int) => (int < 10 ? `0${int}` : int);
function formatDuration(sec) {
    if (!sec || !Number(sec))
        return "00:00";
    const seconds = Math.round(sec % 60);
    const minutes = Math.floor((sec % 3600) / 60);
    const hours = Math.floor(sec / 3600);
    if (hours > 0)
        return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
    if (minutes > 0)
        return `${formatInt(minutes)}:${formatInt(seconds)}`;
    return `00:${formatInt(seconds)}`;
}
exports.formatDuration = formatDuration;
