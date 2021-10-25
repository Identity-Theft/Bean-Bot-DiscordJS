"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorEmbed = exports.simpleEmbed2 = exports.simpleEmbed = void 0;
const discord_js_1 = require("discord.js");
function simpleEmbed(client, description) {
    var _a;
    return new discord_js_1.MessageEmbed()
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
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
