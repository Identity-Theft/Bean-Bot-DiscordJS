import { ChatInputApplicationCommandData, CommandInteraction } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import { ICommand, CommandCategory } from "../../interfaces/ICommand";

export default class BotCommand implements ICommand
{
	public data: ChatInputApplicationCommandData = {
		name: "bot",
		description: "Replies with info about Bean Bot.",
		options: []
	};

	public catergory: CommandCategory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void> {
		const user = client.user!;

		const days = Math.floor(client.uptime! / 86400000);
		const hours = Math.floor(client.uptime! / 3600000) % 24;
		const minutes = Math.floor(client.uptime! / 60000) % 60;
		const seconds = Math.floor(client.uptime! / 1000) % 60;

		interaction.reply({ embeds: [
			new BotEmbed(client)
				.setTitle(user.username)
				.setThumbnail(user.avatarURL())
				.addFields([
					{
						name: "Ping",
						value: `${Math.round(client.ws.ping)} ms`
					},
					{
						name: "Uptime",
						value: `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`
					},
				// {
				// 	name: "Shard",
				// 	value: client.shard
				// }
				])
		]});
	}
}