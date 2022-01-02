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
const discord_js_1 = require("discord.js");
class Queue {
    constructor(voiceChannel, textChannel, startedBy) {
        this.queueMessage = null;
        this.embedPages = [];
        this.currentPage = 0;
        this.paused = false;
        this.loop = 'none';
        this.playing = 0;
        this.songs = [];
        this.maxSongs = 100;
        this.voiceChannel = voiceChannel,
            this.textChannel = textChannel,
            this.startedBy = startedBy;
    }
    generateQueueEmbed(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const embeds = [];
            let k = 10;
            for (let i = 0; i < this.songs.length; i += 10) {
                const current = this.songs.slice(i, k);
                let j = i;
                k += 10;
                const info = current.map(track => `${++j}) [${track.title}](${track.url}) - Added by ${track.addedBy}`).join('\n');
                const embed = {
                    description: info,
                    color: 'BLURPLE'
                };
                embeds.push(new discord_js_1.MessageEmbed(embed));
            }
            const row = new discord_js_1.MessageActionRow()
                .addComponents(new discord_js_1.MessageButton()
                .setCustomId('FirstPage')
                .setEmoji('⬅️')
                .setStyle('PRIMARY'), new discord_js_1.MessageButton()
                .setCustomId('PrevPage')
                .setEmoji('◀️')
                .setStyle('PRIMARY'), new discord_js_1.MessageButton()
                .setCustomId('NextPage')
                .setEmoji('▶️')
                .setStyle('PRIMARY'), new discord_js_1.MessageButton()
                .setCustomId('LastPage')
                .setEmoji('➡️')
                .setStyle('PRIMARY'));
            const embed = embeds[0];
            embed.footer = { text: `Page ${1}/${embeds.length}` };
            if (embeds.length > 1)
                interaction.reply({ embeds: [embed], components: [row] });
            else
                interaction.reply({ embeds: [embed] });
            this.currentPage = 0;
            this.queueMessage = (yield interaction.fetchReply());
            this.embedPages = embeds;
        });
    }
    changePage(page, interaction) {
        if (this.embedPages.length == 1)
            return;
        if (interaction.message != this.queueMessage || this.embedPages.length == 1) {
            interaction.update({ components: [] });
            return;
        }
        const embed = this.embedPages[page];
        embed.footer = { text: `Page ${page + 1}/${this.embedPages.length}` };
        this.currentPage = page;
        interaction.update({ embeds: [embed] });
    }
}
exports.default = Queue;
