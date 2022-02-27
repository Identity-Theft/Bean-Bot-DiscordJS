import { GuildMember } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Event";

export const name = "guildMemberUpdate";

export const run: RunFunction = async (client: Bot, oldMember: GuildMember, newMember: GuildMember) => {
	console.log(oldMember.user.tag);

	if (!oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled())
	{
		newMember.send({ content: `You received a timeout in **${newMember.guild.name}**.`, files: [`${__dirname}/../../../assets/Timeout.mp4`] });
	}

	if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled())
	{
		newMember.send({ content: `Your timeout in **${newMember.guild.name}** has ended.`, files: [`${__dirname}/../../../assets/TimeoutEnd.mov`] });
	}
}