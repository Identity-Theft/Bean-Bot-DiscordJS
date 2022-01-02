import { ButtonInteraction, CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed, MessageEmbedOptions, StageChannel, TextBasedChannel, User, VoiceChannel } from "discord.js";
import Song from "./Song";

export default class Queue
{
	public voiceChannel: VoiceChannel | StageChannel;
	public textChannel: TextBasedChannel;
	public startedBy: User;

	private queueMessage: Message | null = null;
	public embedPages: Array<MessageEmbed> = [];
	public currentPage = 0;

	public paused = false;
	public loop: 'none' | 'song' | 'queue' = 'none'
	public playing = 0;

	public songs: Array<Song> = [];
	public readonly maxSongs = 100;

	public constructor(voiceChannel: VoiceChannel | StageChannel, textChannel: TextBasedChannel, startedBy: User)
	{
		this.voiceChannel = voiceChannel,
		this.textChannel = textChannel,
		this.startedBy = startedBy
	}

	public async generateQueueEmbed(interaction: CommandInteraction): Promise<void>
	{
		const embeds: Array<MessageEmbed> = [];
		let k = 10;

		for (let i = 0; i < this.songs.length; i += 10)
		{
			const current = this.songs.slice(i, k);
			let j = i
			k += 10;

			const info = current.map(track => `${++j}) [${track.title}](${track.url}) - Added by ${track.addedBy}`).join('\n');
			const embed: MessageEmbedOptions = {
				description: info,
				color: 'BLURPLE'
			};

			embeds.push(new MessageEmbed(embed));
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('FirstPage')
					.setEmoji('⬅️')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('PrevPage')
					.setEmoji('◀️')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('NextPage')
					.setEmoji('▶️')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('LastPage')
					.setEmoji('➡️')
					.setStyle('PRIMARY'),
			)

		const embed = embeds[0];
		embed.footer = { text: `Page ${1}/${embeds.length}` }

		if (embeds.length > 1)
			interaction.reply({ embeds: [embed], components: [row] });
		else
			interaction.reply({ embeds: [embed] });

		this.currentPage = 0;
		this.queueMessage = await interaction.fetchReply() as Message;
		this.embedPages = embeds;
	}

	public changePage(page: number, interaction: ButtonInteraction): void
	{
		if (this.embedPages.length == 1) return;

		if (interaction.message != this.queueMessage || this.embedPages.length == 1)
		{
			interaction.update({ components: [] });
			return;
		}

		const embed = this.embedPages[page];
		embed.footer = { text: `Page ${page + 1}/${this.embedPages.length}` };
		this.currentPage = page;

		interaction.update({ embeds: [embed] });
	}
}