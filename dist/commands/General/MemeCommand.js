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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.test = exports.data = void 0;
const fs_1 = __importDefault(require("fs"));
const Utils_1 = require("../../utils/Utils");
exports.data = {
    name: 'meme',
    description: 'Sends a meme.',
    options: [
        {
            name: 'count',
            description: 'Replies with Bean Bot\'s current meme count.',
            type: 'SUB_COMMAND',
        },
        {
            name: 'random',
            description: 'Replies with a random meme.',
            type: 'SUB_COMMAND',
        },
        {
            name: 'choose',
            description: 'Choose a meme.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'number',
                    description: 'Choose a meme.',
                    type: 'INTEGER',
                    required: true,
                },
            ],
        },
    ],
};
exports.test = false;
const run = (client, interaction, options) => __awaiter(void 0, void 0, void 0, function* () {
    interaction.deferReply();
    fs_1.default.readdir(`${__dirname}/../../../assets/memes/`, (err, memes) => {
        if (err) {
            interaction.followUp({ embeds: [(0, Utils_1.errorEmbed)(err.message)], ephemeral: true });
            console.log(err);
            return;
        }
        function sendMeme(file) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const extension = (_a = memes.find(m => m.startsWith(file.toString()))) === null || _a === void 0 ? void 0 : _a.split('.')[1];
                if (extension == 'mp4' || extension == 'mp3')
                    interaction.followUp({ files: [`${__dirname}/../../../assets/memes//${file}.${extension}`] });
                else
                    interaction.followUp({ content: `\`${file}.${extension}\``, files: [`${__dirname}/../../../assets/memes/${file}.${extension}`] });
            });
        }
        if (options.getInteger('number') != null) {
            if (options.getInteger('number') > memes.length || options.getInteger('number') < 1) {
                interaction.followUp({ embeds: [(0, Utils_1.errorEmbed)(`Meme \`${options.getInteger('number')}\` does not exist.`)] });
                return;
            }
            sendMeme(options.getInteger('number'));
        }
        else {
            switch (options.getSubcommand()) {
                case 'count':
                    interaction.followUp({ embeds: [(0, Utils_1.simpleEmbed)(client, `Bean Bot currently has \`${memes.length}\` memes!`)] });
                    break;
                case 'random':
                    let randomIndex = Math.floor(Math.random() * memes.length);
                    if (randomIndex > memes.length)
                        randomIndex = memes.length;
                    if (randomIndex < 1)
                        randomIndex = 1;
                    sendMeme(randomIndex);
                    break;
            }
        }
    });
});
exports.run = run;
