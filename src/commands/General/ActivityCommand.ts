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
					label: "Poker Night",
					description: "Up to 25 particpants",
					value: "poker"
				},
				{
					label: "Chess In The Park",
					description: "Unlimited particpants",
					value: "chess"
				},
				{
					label: "Doodle Crew",
					description: "Up to 16 particpants",
					value: "doodlecrew"
				},
				{
					label: "Letter Tile",
					description: "Up to 8 particpants",
					value: "lettertile"
				},
				{
					label: "SpellCast",
					description: "Up to 100 particpants",
					value: "speelcast"
				},
				{
					label: "Watch Together",
					description: "Unlimited particpants",
					value: "youtube"
				},
				{
					label: "Checkers In The Park",
					description: "Unlimited particpants",
					value: "checkers"
				},
				{
					label: "Word Snacks",
					description: "Up to 8 particpants",
					value: "wordsnacks"
				},
				{
					label: "Betrayal.io",
					description: "Unkown particpants (May not work)",
					value: "betrayal"
				},
				{
					label: "Fishington.io",
					description: "Unkown particpants (May not work)",
					value: "fishing"
				},
				// {
				// 	label: "AwkWord",
				// 	description: "Unkown particpants (May not work)",
				// 	value: "awkword"
				// },
				// {
				// 	label: "Sketchy Artist",
				// 	description: "Unkown particpants (May not work)",
				// 	value: "sketchyartist"
				// }
			])
	);

	interaction.reply({ content: "Select an activity using the dropdown menu below.", components: [row] });
}