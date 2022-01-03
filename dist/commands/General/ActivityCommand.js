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
const discord_js_1 = require("discord.js");
exports.data = {
    name: "activity",
    description: "Start an activity in a VC."
};
const run = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageSelectMenu()
        .setCustomId("activities")
        .setPlaceholder("Select Activty")
        .addOptions([
        {
            label: "Poker Night",
            description: "Up to 25 particpants",
            value: "poker"
        },
        {
            label: "Chess In The Park",
            description: "Unlimited particpants",
            value: "chess"
        },
        {
            label: "Doodle Crew",
            description: "Up to 16 particpants",
            value: "doodlecrew"
        },
        {
            label: "Letter Tile",
            description: "Up to 8 particpants",
            value: "lettertile"
        },
        {
            label: "SpellCast",
            description: "Up to 100 particpants",
            value: "speelcast"
        },
        {
            label: "Watch Together",
            description: "Unlimited particpants",
            value: "youtube"
        },
        {
            label: "Checkers In The Park",
            description: "Unlimited particpants",
            value: "checkers"
        },
        {
            label: "Word Snacks",
            description: "Up to 8 particpants",
            value: "wordsnacks"
        },
        {
            label: "Betrayal.io",
            description: "Unkown particpants (May not work)",
            value: "betrayal"
        },
        {
            label: "Fishington.io",
            description: "Unkown particpants (May not work)",
            value: "fishing"
        },
        // {
        // 	label: "AwkWord",
        // 	description: "Unkown particpants (May not work)",
        // 	value: "awkword"
        // },
        // {
        // 	label: "Sketchy Artist",
        // 	description: "Unkown particpants (May not work)",
        // 	value: "sketchyartist"
        // }
    ]));
    interaction.reply({ content: "Select an activity using the dropdown menu below.", components: [row] });
});
exports.run = run;
