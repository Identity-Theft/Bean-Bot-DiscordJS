import { ApplicationCommandData, CommandInteraction, MessageActionRow, MessageSelectMenu } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";

export const data: ApplicationCommandData = {
	name: "activity",
	description: "Start an activity in a VC."
}



export const run: RunFunction = async (client: Bot, interaction: CommandInteraction) => {
	const row = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("activities")
			.setPlaceholder("Select Activty")
			.addOptions([
				{
					label: "Watch Together",
					description: "Unlimited particpants",
					value: "youtube"
				}
			])
	);

	interaction.reply({ content: "Select an activity using the dropdown menu below.", components: [row] });
}