import { GuildMember } from "discord.js";
import Bot from "../../classes/Bot";
import Event from "../../interfaces/Event";

export default class GuildMemberUpdateEvent implements Event
{
	public name = "guildMemberUpdate";

	public async run(client: Bot, oldMember: GuildMember, newMember: GuildMember): Promise<void>
	{
		console.log(oldMember.user.tag);

		if (!oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled())
		{
			newMember.send({ content: `You received a timeout in **${newMember.guild.name}**.`, files: [`${__dirname}/../../../assets/Timeout.mp4`] });
		}

		if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled())
		{
			newMember.send({ content: `Your timeout in **${newMember.guild.name}** has ended.`, files: [`${__dirname}/../../../assets/reflection.mov`] });
		}
	}
}