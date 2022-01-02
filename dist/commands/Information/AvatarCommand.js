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
    name: 'avatar',
    description: 'Replies with a user\'s avatar.',
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'User to get avatar from.',
            required: true,
        }
    ],
};
const run = (client, interaction, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = options.getUser('user');
    const embed = {
        title: user.tag,
        image: {
            url: (_a = user.avatarURL()) === null || _a === void 0 ? void 0 : _a.toString()
        },
        color: 'BLURPLE'
    };
    interaction.reply({ embeds: [embed] });
});
exports.run = run;
