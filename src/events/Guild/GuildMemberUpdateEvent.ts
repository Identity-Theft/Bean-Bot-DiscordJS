import { ClientEvents, GuildMember } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import IEvent from "../../structures/interfaces/IEvent";

export default class GuildMemberUpdateEvent implements IEvent
{
	public name: keyof ClientEvents = "guildMemberUpdate";

	public async execute(client: ExtendedClient, oldMember: GuildMember, newMember: GuildMember): Promise<void>
	{
		if (!oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled())
		{
			await newMember.send({ content: `You received a timeout in **${newMember.guild.name}**.`, files: [`${__dirname}/../../../assets/Timeout.mp4`] });
		}

		if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled())
		{
			await newMember.send({ content: `Your timeout in **${newMember.guild.name}** has ended.`, files: [`${__dirname}/../../../assets/reflection.mov`] });
		}
	}
}