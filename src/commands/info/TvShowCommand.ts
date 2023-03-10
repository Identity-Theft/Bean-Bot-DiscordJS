import { CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType, ChatInputApplicationCommandData } from "discord.js";
import { CommandCategory, ICommand } from "../../interfaces/ICommand";
import { TvMazeEpidsode as TvMazeEpisode, TvMazeSeason, TvMazeShow } from "../../structures/data/TvMaze";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";

export default class TvShowCommand implements ICommand
{
	public data: ChatInputApplicationCommandData = {
		name: "tv-show",
		description: "Replies with info about a TV Show.",
		options: [
			{
				name: "title",
				description: "Title of the TV Show to search for.",
				type: ApplicationCommandOptionType.String,
				required: true
			}
		]
	};

	public catergory: CommandCategory = CommandCategory.Info;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		interaction.deferReply();

		const title = args.getString("title")!.toLowerCase().trim().replace(" ", "+");

		const show: TvMazeShow = await client.apiRequest(`https://api.tvmaze.com/singlesearch/shows?q=${title}`);

		if (show == null)
		{
			interaction.reply({ embeds: [new ErrorEmbed("TV Show Not Found")] });
			return;
		}

		const seasons: TvMazeSeason[] = await client.apiRequest(`${show._links.self.href}/seasons`);
		const latestEpisode: TvMazeEpisode = await client.apiRequest(show._links.previousepisode.href);

		const embed = new BotEmbed(client)
			.setTitle(`${show.name} (${show.premiered.slice(0, 4)}-${show.ended != null ? show.ended.slice(0, 4) : "Present"})`)
			// .setDescription(data.summary.replace(/<\/?[^>]+(>|$)/g, ""))
			.setThumbnail(show.image != null ? show.image.original : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png")
			.addFields([
				{
					name: "Genre",
					value: show.genres.length != 0 ? show.genres[0] : "None",
					inline: true
				},
				{
					name: "Type",
					value: show.type,
					inline: true
				},
				{
					name: "Language",
					value: show.language,
					inline: true
				},
				{
					name: "Average Runtime",
					value: `~${show.averageRuntime} minutes`,
					inline: true
				},
				{
					name: "Seasons",
					value: seasons.length.toString(),
					inline: true
				},
				{
					name: "Network",
					value: `:flag_${show.network.country.code.toLowerCase()}: ${show.network.name}`,
					inline: true
				},
				{
					name: "Status",
					value: show.status,
					inline: true
				},
				{
					name: "Average Rating",
					value: `${show.rating.average != null ? show.rating.average : "None"}`,
					inline: true
				},
				{
					name: "Sources",
					value: `[IMDB](https://www.imdb.com/title/${show.externals.imdb}), [TVmaze](${show.url})`,
					inline: true
				},
				{
					name: "Latest Episode",
					value: `${latestEpisode.name} (${latestEpisode.airdate.slice(0, 4)})`
				}
			]);

		interaction.followUp({ embeds: [embed] });
	}
}