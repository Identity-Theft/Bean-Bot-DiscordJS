import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { CommandCategory, ICommand } from "../../structures/interfaces/ICommand";
import { Pokemon } from "../../structures/interfaces/PokeAPI/PokeAPI";
import { apiRequest, capitalizeFirstLetter } from "../../utils/Utils";

export default class PokemonCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("pokemon")
		.setDescription("Replies with info a Pokemon.")
		.addStringOption(new SlashCommandStringOption()
			.setName("name")
			.setDescription("Name of the Pokemon to search for.")
			.setRequired(true)
		);

	public category = CommandCategory.Fun;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const name = args.getString("name", true).toLowerCase();

		const pokemon: Pokemon = await apiRequest(`https://pokeapi.co/api/v2/pokemon/${name}`);

		if (!pokemon)
		{
			await interaction.reply({ embeds: [new ErrorEmbed("No pokemon found")]});
			return;
		}

		const embed = new BotEmbed()
			.setTitle(pokemon.name[0].toUpperCase() + pokemon.name.slice(1))
			.setThumbnail(pokemon.sprites.front_default)
			.addFields([
				{
					name: "Height",
					value: `${pokemon.height * 10} cm`,
					inline: true
				},
				{
					name: "Weight",
					value: `${pokemon.weight / 10} kg`,
					inline: true
				},
				{
					name: "Types",
					value: pokemon.types.map(t => capitalizeFirstLetter(t.type.name)).join(", "),
					inline: true
				},
				{
					name: `Abilities [${pokemon.abilities.length}]`,
					value: pokemon.abilities.slice(0, 5).map(a => capitalizeFirstLetter(a.ability.name)).join(", "),
					inline: true
				},
				{
					name: "Stats",
					value: pokemon.stats.map(s => `${capitalizeFirstLetter(s.stat.name)} [${s.base_stat}]`).join(", "),
					inline: true
				},
				{
					name: `Move [${pokemon.moves.length}]`,
					value: pokemon.moves.slice(0, 5).map(m => capitalizeFirstLetter(m.move.name)).join(", "),
					inline: true
				}
			]);

		await interaction.reply({ embeds: [embed] });
	}
}