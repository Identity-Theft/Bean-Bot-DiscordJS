import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { RunFunction } from "../../interfaces/Command";
import fs from 'fs';
import { simpleEmbed, errorEmbed } from "../../utils/Utils";
import Bot from "../../classes/Bot";

export const data: ApplicationCommandData = {
	name: 'meme',
	description: 'Sends a meme.',
	options: [
		{
			name: 'count',
			description: 'Replies with Bean Bot\'s current meme count.',
			type: 'SUB_COMMAND',
		},
		{
			name: 'random',
			description: 'Replies with a random meme.',
			type: 'SUB_COMMAND',
		},
		{
			name: 'choose',
			description: 'Choose a meme.',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'number',
					description: 'Choose a meme.',
					type: 'INTEGER',
					required: true,
				},
			],
		},
	],
}
export const test = true;

export const run: RunFunction = async(client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	interaction.deferReply();

	fs.readdir(`${__dirname}/../../../assets/memes/`, (err, memes) => {
		if (err) {
			interaction.followUp({ embeds: [errorEmbed(err.message)], ephemeral: true });
			console.log(err);
			return;
		}

		async function sendMeme(file: number) {
			const extension = memes.find(m => m.startsWith(file.toString()))?.split('.')[1];

			if (extension == 'mp4' || extension == 'mp3') {
				interaction.followUp({ files: [`${__dirname}/../../../assets/memes//${file}.${extension}`] });
			}
			else {
				interaction.followUp({ content: `\`${file}.${extension}\``, files: [`${__dirname}/../../../assets/memes/${file}.${extension}`] });
			}
		}

		if (options.getInteger('number') != null)
		{
			if (options.getInteger('number')! > memes.length || options.getInteger('number')! < 1 )
			{
				interaction.followUp({ embeds: [errorEmbed(`Meme \`${options.getInteger('number')}\` does not exist.`)] });
				return;
			}
			sendMeme(options.getInteger('number')!);
		}
		else
		{
			switch(options.getSubcommand())
			{
			case 'count':
				interaction.followUp({ embeds: [simpleEmbed(client, `Bean Bot currently has \`${memes.length}\` memes!`)] });
				break;
			case 'random':
				let randomIndex = Math.floor(Math.random() * memes.length);
				if (randomIndex > memes.length) randomIndex = memes.length;
				if (randomIndex < 1) randomIndex = 1;
				sendMeme(randomIndex);
				break;
			}
		}
	});
}