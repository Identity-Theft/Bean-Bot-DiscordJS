import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import { ICommand, CommandCategory } from "../../structures/interfaces/ICommand";

export default class AvatarCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Replies with a user's avatar.")
		.addUserOption(new SlashCommandUserOption()
			.setName("user")
			.setDescription("User to get avatar from.")
			.setRequired(true)
		);

	public category = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const user = args.getUser("user")!;

		interaction.reply({ embeds: [
			new BotEmbed()
				.setDescription(user.tag)
				.setImage(user.avatarURL())
		]});
	}
}