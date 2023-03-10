import { ButtonInteraction, Message, ActionRowBuilder, ButtonBuilder, EmbedBuilder, StageChannel, TextBasedChannel, User, VoiceChannel, ButtonStyle, CommandInteraction } from "discord.js";
import ExtendedClient from "../ExtendedClient";
import { BotEmbed } from "../ExtendedEmbeds";
import Song from "./Song";

export default class Queue
{
	public voiceChannel: VoiceChannel | StageChannel;
	public textChannel: TextBasedChannel;
	public startedBy: User;

	private queueMessage: Message | null = null;
	public embedPages: Array<EmbedBuilder> = [];
	public currentPage = 0;

	public paused = false;
	public loop: "none" | "song" | "queue" = "none"
	public skipped = false;

	public songs: Array<Song> = [];
	public currentSong = 0;
	public readonly maxSongs = 50;

	public constructor(voiceChannel: VoiceChannel | StageChannel, textChannel: TextBasedChannel, startedBy: User)
	{
		this.voiceChannel = voiceChannel;
		this.textChannel = textChannel;
		this.startedBy = startedBy;
	}

	public async generateQueueEmbed(client: ExtendedClient, interaction: CommandInteraction): Promise<void>
	{
		const embeds: Array<EmbedBuilder> = [];
		let k = 10;

		for (let i = 0; i < this.songs.length; i += 10)
		{
			const current = this.songs.slice(i, k);
			let j = i
			k += 10;

			const info = current.map(track => `${++j}) [${track.title}](${track.url}) - Added by ${track.addedBy}`).join("\n");

			embeds.push(new BotEmbed(client).setDescription(info));
		}

		const row = new ActionRowBuilder<any>()
			.setComponents(
				new ButtonBuilder()
					.setCustomId("FirstPage")
					.setEmoji("⏪")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId("PrevPage")
					.setEmoji("◀️")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId("NextPage")
					.setEmoji("▶️")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId("LastPage")
					.setEmoji("⏩")
					.setStyle(ButtonStyle.Primary),
			);

		const embed = embeds[0];
		embed.setDescription(`${embed.data.description}\nPage 1/${embeds.length}`);

		if (embeds.length > 1)
			await interaction.reply({ embeds: [embed], components: [row] });
		else
			await interaction.reply({ embeds: [embed] });

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
		embed.setDescription(`${embed.data.description}\nPage ${page + 1}/${this.embedPages.length}`);
		this.currentPage = page;

		interaction.update({ embeds: [embed] });
	}
}