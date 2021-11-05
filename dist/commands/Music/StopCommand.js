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
    name: 'stop',
    description: 'Disconnet Bean Bot from the Voice Channel and clear the queue.',
    options: []
};
exports.test = false;
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((yield client.botMusicManager.canUseCommand(client, interaction)) == false)
        return;
    client.botMusicManager.disconnect(interaction.guildId);
    const embed = (0, Utils_1.simpleEmbed2)("Disconnected", `${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} was disconnected by ${interaction.user}`);
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
