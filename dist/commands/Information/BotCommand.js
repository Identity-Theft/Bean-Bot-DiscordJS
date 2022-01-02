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
exports.data = {
    name: 'bot',
    description: 'Replies with info about Bean Bot.',
    options: []
};
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const user = client.user;
    const days = Math.floor(client.uptime / 86400000);
    const hours = Math.floor(client.uptime / 3600000) % 24;
    const minutes = Math.floor(client.uptime / 60000) % 60;
    const seconds = Math.floor(client.uptime / 1000) % 60;
    const embed = {
        title: user.username,
        fields: [
            {
                name: "Ping",
                value: `${Math.round(client.ws.ping)} ms`
            },
            {
                name: 'Uptime',
                value: `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`
            },
            // {
            // 	name: 'Shard',
            // 	value: client.shard
            // }
        ],
        color: 'BLURPLE',
        footer: {
            text: `User ID: ${user.id}`
        }
    };
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
