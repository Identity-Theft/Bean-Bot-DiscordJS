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
    name: "previous",
    description: "Play the previous song in the queue."
};
exports.test = false;
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((yield client.musicManager.canUseCommand(client, interaction)) == false)
        return;
    const queue = client.musicManager.getQueue(interaction.guildId);
    if (!queue.songs[queue.playing - 1]) {
        const embed = (0, Utils_1.errorEmbed)("There is no previous song.");
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
    else {
        queue.playing -= 2;
        (_a = client.musicManager.getPlayer(interaction.guildId)) === null || _a === void 0 ? void 0 : _a.stop();
        const embed = (0, Utils_1.simpleEmbed2)("Song Skipped", `Song skipped by ${interaction.user}`);
        interaction.reply({ embeds: [embed] });
    }
});
exports.run = run;