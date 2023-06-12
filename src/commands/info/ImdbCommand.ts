import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandStringOption } from "discord.js";
import { CommandCategory, ICommand } from "../../structures/interfaces/ICommand";
import { ImdbAutoComplete, ImdbAutoCompleteQuery, ImdbMetaData } from "../../structures/interfaces/Imdb";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { apiRequest } from "../../utils/Utils";

export default class ImdbCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("imdb")
		.setDescription("Gets info about a movie or TV show from IMDB.")
		.addSubcommand(new SlashCommandSubcommandBuilder()
			.setName("movie")
			.setDescription("Get info about a Movie from IMDB.")
			.addStringOption(new SlashCommandStringOption()
				.setName("title")
				.setDescription("Movie title.")
				.setRequired(true)
			)
		)
		.addSubcommand(new SlashCommandSubcommandBuilder()
			.setName("series")
			.setDescription("Get info about a TV Series from IMDB.")
			.addStringOption(new SlashCommandStringOption()
				.setName("title")
				.setDescription("TV Series title.")
				.setRequired(true)
			)
		)

	public category: CommandCategory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		await interaction.deferReply();

		const subcommand = args.getSubcommand();

		const search = args.getString("title")!.replace(" ", "%20").toLowerCase();

		const autoCompleteQuery: ImdbAutoCompleteQuery = await apiRequest(`https://imdb8.p.rapidapi.com/auto-complete?q=${search}`, {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '575339ad5bmsh3957d88c36dfcbep1867ccjsnaf07c2266a62',
				'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
			}
		});

		autoCompleteQuery.d = autoCompleteQuery.d.filter(d => d.id.startsWith("tt") && d.qid == (subcommand != "movie" ? `tv${subcommand.charAt(0).toUpperCase() + subcommand.slice(1)}` : "movie"));

		if (autoCompleteQuery.d.length == 0)
		{
			interaction.followUp({ embeds: [new ErrorEmbed(`Could not find ${subcommand} \`${search.replace("%20", " ")}\`.`)]});
			return;
		}

		const autoComplete: ImdbAutoComplete = autoCompleteQuery.d[0];

		const metaData: ImdbMetaData = (await apiRequest(`https://imdb8.p.rapidapi.com/title/get-meta-data?ids=${autoComplete.id}&region=AU`, {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '575339ad5bmsh3957d88c36dfcbep1867ccjsnaf07c2266a62',
				'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
			}
		}))[autoComplete.id];

		const year = `${metaData.title.seriesStartYear != null && metaData.title.seriesStartYear != metaData.title.seriesEndYear ? `${metaData.title.seriesStartYear}-${metaData.title.seriesEndYear != null ? metaData.title.seriesEndYear : "Present"}` : metaData.title.year}`

		const embed = new BotEmbed()
			.setDescription(`${metaData.title.title} (${year})`)
			.setImage(metaData.title.image.url)
			.addFields([
				{
					name: "Runtime",
					value: `${metaData.title.runningTimeInMinutes} Minutes`,
					inline: true
				},
				{
					name: "Rating",
					value: metaData.ratings.rating != null ? `${metaData.ratings.rating.toString()}/10` : "No Ratings",
					inline: true
				},
				{
					name: "Clasification (AU)",
					value: `[${metaData.certificate != null ? `${metaData.certificate}` : "CTC"}](https://www.classification.gov.au/classification-ratings/what-do-ratings-mean)`,
					inline: true
				},
				{
					name: "Release Date",
					value: `<t:${Date.parse(metaData.releaseDate) / 1000}:D>`,
					inline: true
				},
				{
					name: "Generes",
					value: metaData.genres.map(g => g).join(", "),
					inline: true
				},
				{
					name: "Sources",
					value: `[IMDB](https://www.imdb.com${metaData.title.id})`,
					inline: true
				}
			]);

		interaction.followUp({ embeds: [embed] });
	}
}