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
const moment_1 = __importDefault(require("moment"));
exports.data = {
    name: 'user',
    description: 'Replies with info about a user.',
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'User to get info from.',
            required: true,
        }
    ]
};
exports.test = false;
const run = (client, interaction, options) => __awaiter(void 0, void 0, void 0, function* () {
    const user = options.getUser('user');
    const guild = interaction.guild;
    const guildMember = yield guild.members.fetch(user.id);
    const embed = {
        author: {
            name: user.tag,
            icon_url: user.defaultAvatarURL
        },
        thumbnail: {
            url: user.defaultAvatarURL
        },
        fields: [
            {
                name: 'Nickname',
                value: guildMember.nickname !== null ? `${guildMember.nickname}` : 'None',
                inline: true
            },
            {
                name: 'Bot',
                value: user.bot !== false ? 'True' : 'False',
                inline: true
            },
            {
                name: 'Admin',
                value: guildMember.permissions.has('ADMINISTRATOR') ? 'True' : 'False',
                inline: true
            },
            {
                name: 'Joined Server',
                value: moment_1.default.utc(guildMember.joinedAt).format('dddd, MMMM Do YYYY'),
                inline: true
            },
            {
                name: 'Account Created',
                value: moment_1.default.utc(user.createdAt).format('dddd, MMMM Do YYYY'),
                inline: true
            },
            {
                name: `Roles [${guildMember.roles.cache.size}]`,
                value: `${guildMember.roles.cache.map(r => r).join(' ')}`,
            }
        ],
        color: 'BLURPLE',
        footer: {
            text: `User ID: ${user.id}`
        }
    };
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
