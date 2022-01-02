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
exports.run = exports.data = void 0;
const moment_1 = __importDefault(require("moment"));
exports.data = {
    name: 'role',
    description: 'Replies with info about a role.',
    options: [
        {
            type: 'ROLE',
            name: 'role',
            description: 'Role to get info from.',
            required: true
        }
    ]
};
const run = (client, interaction, options) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = interaction.guild;
    const roleId = options.getRole('role').id;
    const role = yield guild.roles.fetch(roleId);
    if (!role)
        return;
    const embed = {
        title: role.name,
        fields: [
            {
                name: 'Mentionable',
                value: role.mentionable ? 'True' : 'False',
                inline: true
            },
            {
                name: 'Hex Colour',
                value: role.hexColor.toString(),
                inline: true
            },
            // {
            // 	name: 'Permissions',
            // 	value: role.permissions.map(p => p).join(' '),
            // 	inline: true
            // },
            {
                name: 'Hoisted',
                value: role.hoist ? 'True' : 'False',
                inline: true
            },
            {
                name: 'Role Created',
                value: moment_1.default.utc(role.createdAt).format('dddd, MMMM Do YYYY'),
                inline: true
            },
            {
                name: 'Position',
                value: role.position.toString(),
                inline: true
            }
        ],
        color: role.color,
        footer: {
            text: `Role ID: ${roleId}`
        }
    };
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
