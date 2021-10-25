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
const discord_js_1 = require("discord.js");
exports.data = {
    name: 'button-test',
    description: 'Button Test.',
    options: [],
};
exports.test = true;
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const row = new discord_js_1.MessageActionRow()
        .addComponents(new discord_js_1.MessageButton()
        .setCustomId('ButtonTest1')
        .setLabel('lmao')
        .setStyle('PRIMARY'));
    interaction.reply({ content: '1', components: [row] });
});
exports.run = run;