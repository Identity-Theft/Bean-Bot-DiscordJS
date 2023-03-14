interface AutoCompleteImage
{
    width: number;
    height: number
    imageUrl: string;
}

export interface ImdbAutoComplete
{
    i: AutoCompleteImage;
    id: string;
    l: string;
    q: string;
    qid: string;
    rank: number;
    s: string;
    y: number;
    yr: string;
}

export interface ImdbAutoCompleteQuery
{
    d: ImdbAutoComplete[];
    q: string;
    v: number;
}

interface ImdbImage
{
    width: number;
    height: number;
    id: string;
    url: string;
}

interface ImdbTitle
{
    '@type': string;
    id: string;
    image: ImdbImage;
    runningTimeInMinutes: number;
    nextEpisode: string;
    numberOfEpisodes: number;
    seriesStartYear: number;
    seriesEndYear: number;
    title: string;
    titleType: string;
    year: number;
}

interface ImdbRank
{
    id: string;
    label: string;
    rank: number;
    rankType: string;
}

interface ImdbRatings
{
    '@type': string;
    id: string;
    title: string;
    titleType: string;
    year: number;
    canRate: boolean;
    otherRanks: ImdbRank[];
    rating: number;
    ratingCount: number;
}

interface ImdbMetacritic
{
    '@type': string;
    id: string;
    reviewCount: number;
    userRatingCount: number;
}

interface ImdbPopularity
{
    '@type': string;
    currentRank: number;
    id: string;
    image: ImdbImage;
    title: string;
    titleType: string;
    year: number;
}

interface ImdbWatchOptionLink
{
    platform: string;
    uri: string;
}

interface ImdbWatchOptionProvider
{
    providerId: string;
    providerTypeId: string;
    refPart: string;
}

interface ImdbWatchOption
{
    link: ImdbWatchOptionLink;
    primaryText: string;
    provider: ImdbWatchOptionProvider;
    secondaryText: string;
}

interface ImdbWatchOptionGroup
{
    displayName: string;
    watchOptions: ImdbWatchOption;
}

interface ImdbWaysToWatch
{
    '@type': string;
    id: string;
    optionGroups: ImdbWatchOptionGroup[];
}

export interface ImdbMetaData
{
    title: ImdbTitle;
    ratings: ImdbRatings;
    metacritic: ImdbMetacritic;
    releaseDate: string;
    popularity: ImdbPopularity;
    waysToWatch: ImdbWaysToWatch;
    genres: string[];
    certificate: string;
}