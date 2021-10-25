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
    name: "jump",
    description: "Jump to song in the queue.",
    options: [
        {
            name: "song",
            description: "Song's position in the queue",
            type: "INTEGER",
            required: true
        }
    ]
};
exports.test = true;
const run = (client, interaction, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((yield client.botMusicManager.canUseCommand(client, interaction)) == false)
        return;
    const guildId = interaction.guildId;
    const queue = client.botMusicManager.getQueue(guildId);
    const position = args.getInteger("song");
    if (queue.songs[position - 1] == null) {
        const embed = (0, Utils_1.errorEmbed)(`Song \`${position}\` does not exist.`);
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }
    if (queue.playing == position - 1) {
        const embed = (0, Utils_1.errorEmbed)(`Song \`${position}\` is already playing.`);
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }
    queue.playing = position - 2;
    (_a = client.botMusicManager.getPlayer(guildId)) === null || _a === void 0 ? void 0 : _a.stop();
    const embed = (0, Utils_1.simpleEmbed2)("Song Skipped", `Song skipped by ${interaction.user}`);
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
