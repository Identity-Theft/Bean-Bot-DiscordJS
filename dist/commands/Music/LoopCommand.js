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
exports.run = exports.data = void 0;
const Utils_1 = require("../../utils/Utils");
exports.data = {
    name: 'loop',
    description: 'Loop the current song or the queue.',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'none',
            description: 'Do not loop.'
        },
        {
            type: 'SUB_COMMAND',
            name: 'song',
            description: 'Loop the current song.'
        },
        {
            type: 'SUB_COMMAND',
            name: 'queue',
            description: 'Loop the queue.'
        }
    ]
};
const run = (client, interaction, options) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield client.musicManager.canUseCommand(client, interaction)) == false)
        return;
    client.musicManager.queues.get(interaction.guildId).loop = options.getSubcommand();
    interaction.reply({ embeds: [(0, Utils_1.simpleEmbed2)("Loop", `Now Looping: \`${options.getSubcommand()}\``)] });
});
exports.run = run;
