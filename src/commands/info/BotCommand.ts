import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder } from "discord.js";
import Bot from "../../classes/Bot";
import { Command, CommandCategory } from "../../classes/Command";

export default class BotCommand extends Command
{
	public data: ChatInputApplicationCommandData = {
		name: "bot",
		description: "Replies with info about Bean Bot.",
		options: []
	};

	public catergory: CommandCategory = CommandCategory.Info;

	public async execute(client: Bot, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const user = client.user!;

		const days = Math.floor(client.uptime! / 86400000);
		const hours = Math.floor(client.uptime! / 3600000) % 24;
		const minutes = Math.floor(client.uptime! / 60000) % 60;
		const seconds = Math.floor(client.uptime! / 1000) % 60;

		interaction.reply({ embeds: [
			new EmbedBuilder()
				.setTitle(user.username)
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
				.setColor("Blurple")
				.setFooter({text: `User ID: ${user.id}`})
		]});
	}
}