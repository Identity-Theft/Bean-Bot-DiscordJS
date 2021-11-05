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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.test = exports.data = void 0;
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
exports.data = {
    name: 'server',
    description: 'Replies with info about the server.',
    options: [],
};
exports.test = false;
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = interaction.guild;
    if (!guild.available)
        return;
    const sOwner = yield guild.members.fetch(guild.ownerId);
    const embed = new discord_js_1.MessageEmbed()
        .setAuthor(guild.name)
        .addFields({ name: 'Owner', value: `${sOwner}`, inline: true }, { name: 'Creation Date', value: moment_1.default.utc(guild.createdAt).format('MMMM Do YYYY'), inline: true }, { name: 'Partnerd', value: guild.partnered ? 'True' : 'False', inline: true }, { name: 'Verified', value: guild.verified ? 'True' : 'False', inline: true }, { name: 'Boost Level', value: `[${guild.premiumTier}](https://discord.com/developers/docs/resources/guild#guild-object-premium-tier)`, inline: true }, { name: 'Boosts', value: guild.premiumSubscriptionCount.toString(), inline: true }, { name: 'Verification Level', value: `[${guild.verificationLevel}](https://discord.com/developers/docs/resources/guild#guild-object-verification-level)`, inline: true });
    if (guild.rulesChannel)
        embed.addField('Rules Channel', `${guild.rulesChannel}`, true);
    if (guild.afkChannel)
        embed.addField('AFK Channel', `${guild.afkChannel}`, true);
    embed
        .addFields({ name: 'Channel Categories', value: guild.channels.cache.filter(e => e.type == 'GUILD_CATEGORY').size.toString(), inline: true }, { name: 'Text Channels', value: guild.channels.cache.filter(e => e.type == 'GUILD_TEXT').size.toString(), inline: true }, { name: 'Voice Channels', value: guild.channels.cache.filter(e => e.type == 'GUILD_VOICE').size.toString(), inline: true }, { name: 'Members', value: `${guild.memberCount}/${guild.maximumMembers}`, inline: true }, { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true }, { name: 'Emojis', value: guild.emojis.cache.size.toString(), inline: true })
        .setColor('BLURPLE')
        .setFooter(`Server ID: ${guild.id}`);
    if (guild.iconURL()) {
        embed
            .setAuthor(guild.name, guild.iconURL())
            .setThumbnail(guild.iconURL());
    }
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
