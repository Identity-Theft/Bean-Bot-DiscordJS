"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDuration = exports.errorEmbed = exports.simpleEmbed2 = exports.simpleEmbed = void 0;
const discord_js_1 = require("discord.js");
function simpleEmbed(client, description) {
    var _a;
    return new discord_js_1.MessageEmbed()
        .setAuthor(client.user.username, (_a = client.user) === null || _a === void 0 ? void 0 : _a.avatarURL())
        .setDescription(description)
        .setColor('BLURPLE');
}
exports.simpleEmbed = simpleEmbed;
function simpleEmbed2(name, description) {
    return new discord_js_1.MessageEmbed()
        .setTitle(name)
        .setDescription(description)
        .setColor('BLURPLE');
}
exports.simpleEmbed2 = simpleEmbed2;
function errorEmbed(err) {
    return new discord_js_1.MessageEmbed()
        .setTitle('Error')
        .setDescription(err)
        .setColor('RED');
}
exports.errorEmbed = errorEmbed;
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
