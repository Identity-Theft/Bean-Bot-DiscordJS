import { ApplicationCommandData, CommandInteraction } from "discord.js";
import { RunFunction } from "../interfaces/Command";
import fs from 'fs';
import { embed, errorEmbed } from "../utils/Utils";
import { Bot } from "../client/Client";

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
export const test: boolean = true;

export const run: RunFunction = async(client: Bot, interaction: CommandInteraction, args: Map<string, any>) => {
    interaction.deferReply();

    fs.readdir(`${__dirname}/../../memes/`, (err, memes) => {
        if (err) {
            interaction.followUp({ embeds: [errorEmbed(err.message)], ephemeral: true });
            console.log(err);
            return;
        }

        async function sendMeme(file: number) {
            const extension = memes.find(m => m.startsWith(file.toString()))?.split('.')[1];
        
            if (extension == 'mp4' || extension == 'mp3') {
                interaction.followUp({ files: [`${__dirname}/../../memes/${file}.${extension}`] });
            }
            else {
                interaction.followUp({ content: `\`${file}.${extension}\``, files: [`${__dirname}/../../memes/${file}.${extension}`] });
            }
        }

        if (args.get('number'))
        {
            sendMeme( args.get('number'));
        }
        else
        {
            switch(args.get('option'))
            {
                case 'count':
                    interaction.followUp({ embeds: [embed(client, `Bean Bot currently has \`${memes.length}\` memes!`)] });
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