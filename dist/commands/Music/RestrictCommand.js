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
    name: 'music-restrict',
    description: 'Retricts music commands to admins',
    options: []
};
exports.test = false;
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield client.musicManager.canUseCommand(client, interaction)) == false)
        return;
    const queue = yield client.musicManager.getQueue(interaction.guildId);
    queue.restricted = !queue.restricted;
    const embed = (0, Utils_1.simpleEmbed2)("Restricted", `The queue is now restricted to admins only.`);
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
