import { CommandInteraction, CommandInteractionOptionResolver, CacheType, SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import { ICommand, CommandCategory } from "../../structures/interfaces/ICommand";

export default class GayCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("gay")
		.setDescription("Replies with how gay a user is.")
		.addUserOption(new SlashCommandUserOption()
			.setName("user")
			.setDescription("User.")
			.setRequired(true)
		);

	public category: CommandCategory = CommandCategory.Fun;

	public async execute(client: ExtendedClient, interaction: CommandInteraction<CacheType>, args: CommandInteractionOptionResolver<CacheType>): Promise<void> {
		const user = args.getUser("user");
		const percent = (Math.random() * 100).toFixed(0);
		const embed = new BotEmbed(client).setDescription(`${user} is ${percent}% gay.`);
		interaction.reply({ embeds: [embed] });
	}
}