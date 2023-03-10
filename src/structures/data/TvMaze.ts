interface TvMazeSchedule
{
	time: string;
	days: string[];
}

interface TvMazeRating
{
	average: number;
}

interface TvMazeCountry
{
	name: string;
	code: string;
	timezone: string;
}

interface TvMazeNetwork
{
	id: number;
	name: string;
	country: TvMazeCountry;
	officialSite: string;
}

interface TvMazeExternals
{
	tvrage: number;
	thetvdb: number;
	imdb: string;
}

interface TvMazeImage
{
	medium: string;
	original: string;
}

interface TvMazeLink
{
	href: string;
}

interface TvMazeShowLink
{
	self: TvMazeLink;
	previousepisode: TvMazeLink;
	nextepisode: TvMazeLink;
}

interface TvMazeSeasonLink
{
	self: TvMazeLink;
}

interface TvMazeEpisodeLink
{
	self: TvMazeLink;
	show: TvMazeLink;
}

export interface TvMazeShow
{
	id: number;
	url: string;
	name: string;
	type: string;
	language: string;
	genres: string[];
	status: string;
	runtime: number;
	averageRuntime: number;
	premiered: string;
	ended: string;
	officialSite: string;
	schedule: TvMazeSchedule;
	rating: TvMazeRating;
	weight: number; // what is weight???
	network: TvMazeNetwork;
	webChannel: TvMazeNetwork;
	dvdCountry: TvMazeCountry;
	externals: TvMazeExternals;
	image: TvMazeImage;
	summary: string;
	updated: number;
	_links: TvMazeShowLink;
}

export interface TvMazeSeason
{
	id: number;
	url: string;
	number: number;
	name: string;
	episodeOrder: number;
	premiereDate: string;
	endDate: string;
	network: TvMazeNetwork;
	webChannel: TvMazeNetwork;
	image: TvMazeImage;
	summary: string;
	_links: TvMazeSeasonLink;
}

export interface TvMazeEpidsode
{
	id: number;
	url: string;
	name: string;
	season: number;
	number: number;
	type: string;
	airdate: string;
	airtime: string;
	airstamp: string;
	runtime: number;
	rating: TvMazeRating;
	image: TvMazeImage;
	summary: string;
	_links: TvMazeEpisodeLink;
}