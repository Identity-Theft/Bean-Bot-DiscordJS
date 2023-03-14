import { GuildBan } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import IEvent from "../../structures/interfaces/IEvent";

export default class GuildBanRemoveEvent implements IEvent
{
	public name = "guildBanRemove";

	public async execute(client: ExtendedClient, ban: GuildBan): Promise<void>
	{
		console.log(`Unbanned ${ban.user.username} from ${ban.guild.name}`)
		ban.user.send({
			content: `You have been unbanned from **${ban.guild.name}**.`,
			files: [`${__dirname}/../../../assets/reflection.mov`]
		})
	}
}