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
    name: "activity",
    description: "Start an activity in a VC.",
    options: [
        {
            type: "SUB_COMMAND",
            name: "list-activities",
            description: "Get a list of all activities."
        },
        {
            type: "SUB_COMMAND",
            name: "youtube",
            description: "Play YouTube videos in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "poker",
            description: "Play Poker in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "betrayal",
            description: "Play Betrayal in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "fishing",
            description: "Play Fishing in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "chess",
            description: "Play Chess in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "lettertile",
            description: "Play Lettertile in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "wordsnack",
            description: "Play Wordsnack in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "doodlecrew",
            description: "Play Doodlecrew in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "awkword",
            description: "Play Awkword in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "spellcast",
            description: "Play Spellcast in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "checkers",
            description: "Play Checkers in VC."
        },
        {
            type: "SUB_COMMAND",
            name: "puttparty",
            description: "Play Puttparty in VC."
        },
        // {
        // 	type: "SUB_COMMAND",
        // 	name: "sketchyartist",
        // 	description: "Play Sketchyartist in VC."
        // }
    ]
};
const run = (client, interaction, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const member = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(interaction.user.id);
    if (options.getSubcommand() == "list-activities") {
        const embed = {
            title: "Activities",
            description: "YouTube, Poker, Betrayal, Fishing, Chess, Lettertile, Wordsnack, Doodlecrew, Awkword, Spellcast, Checkers, Puttparty, ~~Sketchy Artist~~"
        };
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (member) {
        if (member.voice.channel) {
            client.discordTogether.createTogetherCode(member.voice.channel.id, options.getSubcommand()).then((invite) => __awaiter(void 0, void 0, void 0, function* () {
                return interaction.reply({ content: `Click the link to start the activity then have everyone else click 'Join' or 'Spectate': ${invite.code}`, ephemeral: true });
            }));
        }
    }
});
exports.run = run;
