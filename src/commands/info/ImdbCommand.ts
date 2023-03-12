import { CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType, ChatInputApplicationCommandData } from "discord.js";
import { CommandCategory, ICommand } from "../../interfaces/ICommand";
import { ImdbAutoComplete, ImdbAutoCompleteQuery, ImdbMetaData } from "../../structures/data/Imdb";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";

export default class ImdbCommand implements ICommand
{
	public data: ChatInputApplicationCommandData = {
		name: "imdb",
		description: "Gets info about a movie or TV show from IMDB.",
		options: [
			{
				name: "movie",
				description: "Get info about a movie.",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "title",
						description: "Movie title.",
						type: ApplicationCommandOptionType.String,
						required: true
					}
				]
			},
			{
				name: "series",
				description: "Get info about a TV series.",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "title",
						description: "TV series title.",
						type: ApplicationCommandOptionType.String,
						required: true
					}
				]
			}
		]
	};

	public catergory: CommandCategory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		await interaction.deferReply();

		const subcommand = args.getSubcommand();

		const search = args.getString("title")!.replace(" ", "%20").toLowerCase();

		const autoCompleteQuery: ImdbAutoCompleteQuery = await client.apiRequest(`https://imdb8.p.rapidapi.com/auto-complete?q=${search}`, {
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

		const metaData: ImdbMetaData = (await client.apiRequest(`https://imdb8.p.rapidapi.com/title/get-meta-data?ids=${autoComplete.id}&region=AU`, {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '575339ad5bmsh3957d88c36dfcbep1867ccjsnaf07c2266a62',
				'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
			}
		}))[autoComplete.id];

		const year = `${metaData.title.seriesStartYear != null && metaData.title.seriesStartYear != metaData.title.seriesEndYear ? `${metaData.title.seriesStartYear}-${metaData.title.seriesEndYear != null ? metaData.title.seriesEndYear : "Present"}` : metaData.title.year}`

		const embed = new BotEmbed(client)
			.setTitle(`${metaData.title.title} (${year})`)
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