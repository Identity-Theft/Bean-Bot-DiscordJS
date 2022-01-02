import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, MessageEmbedOptions } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Command";

export const data: ApplicationCommandData = {
	name: "activity",
	description: "Start an activity in a VC.",
	options: [
		{
			type: "SUB_COMMAND",
			name: "list-activities",
			description: "Get a list of all activities."
		},
		{
			type: "SUB_COMMAND",
			name: "youtube",
			description: "Play YouTube videos in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "poker",
			description: "Play Poker in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "betrayal",
			description: "Play Betrayal in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "fishing",
			description: "Play Fishing in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "chess",
			description: "Play Chess in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "lettertile",
			description: "Play Lettertile in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "wordsnack",
			description: "Play Wordsnack in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "doodlecrew",
			description: "Play Doodlecrew in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "awkword",
			description: "Play Awkword in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "spellcast",
			description: "Play Spellcast in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "checkers",
			description: "Play Checkers in VC."
		},
		{
			type: "SUB_COMMAND",
			name: "puttparty",
			description: "Play Puttparty in VC."
		},
		// {
		// 	type: "SUB_COMMAND",
		// 	name: "sketchyartist",
		// 	description: "Play Sketchyartist in VC."
		// }
	]
}

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	const member = interaction.guild?.members.cache.get(interaction.user.id);

	if (options.getSubcommand() == "list-activities")
	{
		const embed: MessageEmbedOptions = {
			title: "Activities",
			description: "YouTube, Poker, Betrayal, Fishing, Chess, Lettertile, Wordsnack, Doodlecrew, Awkword, Spellcast, Checkers, Puttparty, ~~Sketchy Artist~~"
		};

		return interaction.reply({ embeds: [embed], ephemeral: true });
	}

	if (member)
	{
		if (member.voice.channel)
		{
			client.discordTogether.createTogetherCode(member.voice.channel.id, options.getSubcommand()).then(async invite => {
				return interaction.reply({ content: `Click the link to start the activity then have everyone else click 'Join' or 'Spectate': ${invite.code}`, ephemeral: true});
			});
		}
	}
}