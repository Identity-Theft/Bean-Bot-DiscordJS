interface PokemonGenerationSprite
{
    front_default: string;
    front_gray: string;
    front_transparent: string;

	front_shiny: string;
	front_shiny_transparent: string;

    front_female: string;
	front_shiny_female: string;

    back_default: string;
    back_gray: string;
    back_transparent: string;

	back_shiny: string;
    back_shiny_transparent: string;

	back_female: string;
	back_shiny_female: string;
}

interface PokemonGenerationIcons
{
    front_default: string;
	front_female: string;
}

interface PokemonGenerationAnimatedSprite
{
    animated: PokemonGenerationSprite;

    back_default: string;
	bcak_female: string;
	back_shiny: string;
	back_shiny_female: string;

    front_default: string;
	front_female: string;
	front_shiny: string;
	front_shiny_female: string;
}

export interface PokemonGen1Sprites
{
    'red-blue': PokemonGenerationSprite;
    yellow: PokemonGenerationSprite;
}

export interface PokemonGen2Sprites
{
    crystal: PokemonGenerationSprite;
    gold: PokemonGenerationSprite
    silver: PokemonGenerationSprite;
}

export interface PokemonGen3Sprites
{
    emerald: PokemonGenerationSprite;
    'firered-leafgreen': PokemonGenerationSprite;
    'ruby-sapphire': PokemonGenerationSprite;
}

export interface PokemonGen4Sprites
{
    'diamond-pearl': PokemonGenerationSprite;
    'heartgold-soulsilver': PokemonGenerationSprite;
    platnium: PokemonGenerationSprite;
}

export interface PokemonGen5Sprites
{
    'black-white': PokemonGenerationAnimatedSprite;
}

export interface PokemonGen6Sprites
{
    'omegaruby-alphasapphire': PokemonGenerationSprite;
    'x-y': PokemonGenerationSprite;
}

export interface PokemonGen7Sprites
{
    icons: PokemonGenerationIcons;
    'ultra-sun-ultra-moon': PokemonGenerationSprite;
}

export interface PokemonGen8Sprites
{
    icon: PokemonGenerationIcons;
}