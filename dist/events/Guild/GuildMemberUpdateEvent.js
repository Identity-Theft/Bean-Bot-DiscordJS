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
    console.log(newMember.user.username);
    if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled()) {
        newMember.send({ content: `Your time out in **${newMember.guild.name}** has ended.`, files: [`${__dirname}/../../../assets/reflection.mov`] });
    }
});
exports.run = run;
