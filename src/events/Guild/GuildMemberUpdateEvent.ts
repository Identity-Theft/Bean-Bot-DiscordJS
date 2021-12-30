import { GuildMember } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Event";

export const name = "guildMemberUpdate";

export const run: RunFunction = async (client: Bot, oldMember: GuildMember, newMember: GuildMember) => {
	console.log(newMember.user.username);
	if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled())
	{
		newMember.send({ content: `Your time out in **${newMember.guild.name}** has ended.`, files: [`${__dirname}/../../../assets/reflection.mov`] });
	}
}