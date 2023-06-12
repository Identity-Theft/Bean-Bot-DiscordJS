import { ButtonInteraction, CommandInteraction, EmbedBuilder, InteractionCollector, Message, User } from "discord.js";
import { apiRequest, formatDuration, getRow, getRowDisabled, searchYoutube } from "../../utils/Utils";
import { AudioResource, StreamType, createAudioResource } from "@discordjs/voice";
import NewgroundsResponse from "../interfaces/Music/NewgroundsResponse";
import ytdl from "ytdl-core";
import { ErrorEmbed, TrackEmbed } from "../ExtendedEmbeds";
import lodash from "lodash";
import ExtendedClient from "../ExtendedClient";

export default class Track
{
	public readonly title: string;
	public readonly formattedTitle: string;
	public readonly shortTitle: string;

	public readonly thumbnail: string | null;
	public readonly url: string;

	public readonly duration: string;
	public readonly durationSeconds: number;

	public readonly addedBy: User;
	public readonly platform: TrackPlatform;

	// Lyrics
	private lyricsEmbeds: EmbedBuilder[] = [];
	private lyricsPage: number = 0;
	private lyricsReply: Message | null = null;
	private lyricsCollector: InteractionCollector<any> | null = null;

	public constructor(title: string, url: string, durationSeconds: number, addedBy: User, platform: TrackPlatform, thumbnail: string | null = null, titleExtras: string = "")
	{
		this.title = title;
		this.formattedTitle = `[**${title.replace("*", "\\*").replace("_", "\\*").replace("~", "\\~")} ${titleExtras}**](${url})`
		this.shortTitle = `[**${title.slice(0, 35)}${title.length > 35 ? " ..." : ""}**](${url})`

		this.thumbnail = thumbnail;
		this.url = url;
		
		this.duration = formatDuration(durationSeconds);
		this.durationSeconds = durationSeconds;

		this.addedBy = addedBy;
		this.platform = platform;
	}

	public async createResource(): Promise<AudioResource>
	{
		switch (this.platform)
		{
			case TrackPlatform.YouTube:
				return createAudioResource(ytdl(this.url, { filter: "audioonly", highWaterMark: 1048576 * 32 }), { inputType: StreamType.Arbitrary, inlineVolume: true });
			case TrackPlatform.Spotify:
				const streamUrl = await searchYoutube(this.title, this.durationSeconds);
				if (!streamUrl) throw new Error('Track unavliable');

				return createAudioResource(ytdl(streamUrl, { filter: "audioonly", highWaterMark: 1048576 * 32 }), { inputType: StreamType.Arbitrary, inlineVolume: true });
			case TrackPlatform.Newgrounds:
				const data: NewgroundsResponse = await apiRequest(this.url.replace("listen", "feed"));
				return createAudioResource(data.stream_url, { inputType: StreamType.Arbitrary });
			default:
				return createAudioResource(this.url, { inputType: StreamType.Arbitrary, inlineVolume: true });
		}
	}

	public async getLyrics(client: ExtendedClient, interaction: CommandInteraction)
	{
		await interaction.deferReply();

		if (this.platform != TrackPlatform.Spotify)
		{
			interaction.followUp({ embeds: [new ErrorEmbed("Lyrics are only avalible for Spotify tracks")]});
			return;
		}

		if (this.lyricsEmbeds.length == 0)
		{
			const searches = await client.geniusClient.songs.search(this.title.split("-")[0].trim());

			const geniusSong = searches[0];
			const splitLyrics = lodash.chunk((await geniusSong.lyrics()).split("\n"), 30);
			const lyrics: string[] = [];

			for (let index = 0; index < splitLyrics.length; index++) {
				lyrics.push(splitLyrics[index].join(`\n`));
			}

			for (let i = 0; i < lyrics.length; i++) {
				this.lyricsEmbeds.push(new TrackEmbed(`${this.formattedTitle}\n------------------------------\n${lyrics[i]}\n------------------------------\n**Page ${i + 1}/${lyrics.length}**`, this.platform));
			}
		}
		else this.clearLyricsEmbeds();

		this.lyricsReply = await interaction.followUp({ embeds: [this.lyricsEmbeds[0]], components: [getRow(this.lyricsPage, this.lyricsEmbeds.length, "lyrics")] });
		this.lyricsCollector = this.lyricsReply.createMessageComponentCollector();

		this.lyricsCollector.on('collect', (buttonInt: ButtonInteraction) => {
			switch (buttonInt.customId)
			{
				case "lyrics-FirstPage":
					this.lyricsPage = 0;
					break;
				case "lyrics-PrevPage":
					--this.lyricsPage
					break;
				case "lyrics-NextPage":
					++this.lyricsPage
					break;
				case "lyrics-LastPage":
					this.lyricsPage = this.lyricsEmbeds.length - 1;
					break;
			}

			buttonInt.update({ embeds: [this.lyricsEmbeds[this.lyricsPage]], components: [getRow(this.lyricsPage, this.lyricsEmbeds.length, "lyrics")] });
		});
	}

	public clearLyricsEmbeds()
	{
		if (!this.lyricsCollector) return;
		this.lyricsReply?.delete();
		this.lyricsCollector!.removeAllListeners();


		this.lyricsPage = 0;
		this.lyricsReply = null;
		this.lyricsCollector = null;
	}
}

export enum TrackPlatform {
	Discord,
	YouTube,
	Newgrounds,
	Spotify
}