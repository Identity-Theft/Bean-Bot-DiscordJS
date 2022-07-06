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
const Utils_1 = require("../../utils/Utils");
exports.name = 'interactionCreate';
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (interaction.isCommand()) {
        if (interaction.guild == null) {
            interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('Bean Bot must be used in a server.')], ephemeral: true });
            return;
        }
        const { commandName, options } = interaction;
        const channelUsed = yield (0, Utils_1.getChannel)(client, interaction.guildId, interaction.channelId);
        if (!(channelUsed === null || channelUsed === void 0 ? void 0 : channelUsed.includes("bot"))) {
            interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('Bean Bot must be used in a bot channel.')], ephemeral: true });
            return;
        }
        const cmd = client.commands.get(commandName);
        if (!cmd) {
            interaction.reply({ embeds: [(0, Utils_1.errorEmbed)(`Command \`/${commandName}\` doesn't exist or couldn't be loaded.`)], ephemeral: true });
            return;
        }
        cmd.run(client, interaction, options);
    }
    else if (interaction.isButton()) {
        if (interaction.message.author.id != ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id))
            return;
        const queue = client.musicManager.queues.get(interaction.guildId);
        switch (interaction.customId) {
            case 'ButtonTest1':
                interaction.update({ embeds: [(0, Utils_1.simpleEmbed)(client, 'Beans')] });
                break;
            case 'FirstPage':
                if (queue == undefined)
                    return;
                queue === null || queue === void 0 ? void 0 : queue.changePage(0, interaction);
                break;
            case 'PrevPage':
                if (queue == undefined)
                    return;
                queue === null || queue === void 0 ? void 0 : queue.changePage(queue.currentPage - 1, interaction);
                break;
            case 'NextPage':
                if (queue == undefined)
                    return;
                queue === null || queue === void 0 ? void 0 : queue.changePage(queue.currentPage + 1, interaction);
                break;
            case 'LastPage':
                if (queue == undefined)
                    return;
                queue === null || queue === void 0 ? void 0 : queue.changePage(queue.embedPages.length - 1, interaction);
                break;
        }
    }
    else if (interaction.isSelectMenu()) {
        if (interaction.message.author.id != ((_b = client.user) === null || _b === void 0 ? void 0 : _b.id))
            return;
        if (interaction.user.id != ((_c = interaction.message.interaction) === null || _c === void 0 ? void 0 : _c.user.id)) {
            interaction.reply({ content: "Only the user who created the select menu can respond.", ephemeral: true });
            return;
        }
        // Bot has no select menus yet
    }
});
exports.run = run;
