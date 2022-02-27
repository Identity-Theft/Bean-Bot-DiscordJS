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
exports.run = exports.name = void 0;
exports.name = "guildMemberUpdate";
const run = (client, oldMember, newMember) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(oldMember.user.tag);
    if (!oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled()) {
        newMember.send({ content: `You received a timeout in **${newMember.guild.name}**.`, files: [`${__dirname}/../../../assets/Timeout.mp4`] });
    }
    if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled()) {
        newMember.send({ content: `Your timeout in **${newMember.guild.name}** has ended.`, files: [`${__dirname}/../../../assets/TimeoutEnd.mov`] });
    }
});
exports.run = run;
