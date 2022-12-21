import { GuildBan } from "discord.js";
import Bot from "../../classes/Bot";
import Event from "../../interfaces/Event";

export default class GuildBanRemoveEvent implements Event
{
	public name = "guildBanRemove";

	public async run(client: Bot, ban: GuildBan): Promise<void>
	{
		console.log(`Unbanned ${ban.user.username} from ${ban.guild.name}`)
		ban.user.send({
			content: `You have been unbanned from **${ban.guild.name}**.`,
			files: [`${__dirname}/../../../assets/reflection.mov`]
		})
	}
}