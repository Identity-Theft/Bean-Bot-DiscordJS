import { PokemonGen1Sprites, PokemonGen2Sprites, PokemonGen3Sprites, PokemonGen4Sprites, PokemonGen5Sprites, PokemonGen6Sprites, PokemonGen7Sprites, PokemonGen8Sprites } from "./PokeApiSprites";

export interface Pokemon
{
	abilities: PokemonAbility[];
	base_experience: number;
	forms: PokemonURL[];
	game_indices: PokemonGameIndice[];
	height: number;
	held_items: PokemonHeldItem[];
	id: number;
	is_default: boolean;
	location_area_encounters: string;
	moves: PokemonMove[];
	name: string;
	order: number;
	past_types: PokemonType[];
	species: PokemonURL;
	sprites: PokemonSpriteCollection;
	stats: PokemonStat[];
	types: PokemonType[];
	weight: number;
}

interface PokemonURL
{
	name: string;
	url: string;
}

interface PokemonAbility
{
	ability: PokemonURL;
	is_hidden: boolean;
	slot: number;
}

interface PokemonGameIndice
{
	game_index: number;
	version: PokemonURL;
}

interface PokemonHeldItem
{
	item: PokemonURL;
	version_details: PokemonHeldItemVersion[];
}

interface PokemonHeldItemVersion
{
	rarity: number;
	version: PokemonURL;
}

interface PokemonMove
{
	move: PokemonURL;
	version_group_details: PokemonMoveVersion;
}

interface PokemonMoveVersion
{
	level_learned_at: number;
	move_learn_method: PokemonURL;
	version_group: PokemonURL;
}

interface PokemonSpriteCollection
{
	back_default: string;
	back_female: string;
	back_shiny: string;
	back_shiny_female: string;

	front_default: string;
	frony_female: string;
	front_shiny: string;
	front_shiny_female: string;

	other: PokemonSpritesOther;
	versions: PokemonSpritesVersions;
}

interface PokemonSpritesOther
{
	dream_world: PokemonGenericSprite;
	home: PokemonGenericSprite;
	'official-artwork': PokemonGenericSprite;
}

interface PokemonSpritesVersions
{
	'generation-i': PokemonGen1Sprites;
	'generation-ii': PokemonGen2Sprites;
	'generation-iii': PokemonGen3Sprites;
	'generation-iv': PokemonGen4Sprites;
	'generation-v': PokemonGen5Sprites;
	'generation-vi': PokemonGen6Sprites;
	'generation-vii': PokemonGen7Sprites;
	'generation-viii': PokemonGen8Sprites;
}

interface PokemonGenericSprite
{
	back_default: string;
	back_female: string;
	back_shiny: string;
	back_shiny_female: string;

	front_default: string;
	frony_female: string;
	front_shiny: string;
	front_shiny_female: string;
}

interface PokemonStat
{
	base_stat: number;
	effort: number;
	stat: PokemonURL;
}

interface PokemonType
{
	slot: number;
	type: PokemonURL;
}