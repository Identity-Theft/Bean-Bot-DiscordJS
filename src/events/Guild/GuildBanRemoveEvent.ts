import { GuildBan } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Event";

export const name = "guildBanRemove";

export const run: RunFunction = async (client: Bot, ban: GuildBan) => {
	console.log(`Unbanned ${ban.user.username} from ${ban.guild.name}`)
	ban.user.send({
		content: `You have been unbanned from **${ban.guild.name}**.`,
		files: [`${__dirname}/../../../assets/reflection.mov`]
	})
}