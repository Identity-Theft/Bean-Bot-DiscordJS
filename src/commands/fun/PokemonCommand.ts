import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed, ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { CommandCategory, ICommand } from "../../structures/interfaces/ICommand";
import { Pokemon } from "../../structures/interfaces/PokeAPI";

export default class PokemonCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("pokemon")
		.setDescription("Replies with info a Pokemon.")
		.addStringOption(new SlashCommandStringOption()
			.setName("name")
			.setDescription("Name of the Pokemon to serach for.")
			.setRequired(true)
		) as SlashCommandBuilder;

	public catergory = CommandCategory.Debug;

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const name = args.getString("name")?.toLowerCase();

		const pokemon: Pokemon = await client.apiRequest(`https://pokeapi.co/api/v2/pokemon/${name}`);

		if (pokemon == undefined)
		{
			interaction.reply({ embeds: [new ErrorEmbed("No pokemon found \\<3")]});
			return;
		}

		const embed = new BotEmbed(client)
			.setTitle(pokemon.name[0].toUpperCase() + pokemon.name.slice(1))
			.setThumbnail(pokemon.sprites.front_default)
			.addFields([
				{
					name: "Height",
					value: `${pokemon.height} cm`,
					inline: true
				},
				{
					name: "Weight",
					value: `${pokemon.weight} kg`,
					inline: true
				},
				{
					name: "Stats",
					value: pokemon.stats.map(s => `${s.stat.name[0].toUpperCase() + s.stat.name.slice(1)} [${s.base_stat}]`).join(", "),
					inline: true
				},
				{
					name: "Abilities",
					value: pokemon.abilities.map(a => a.ability.name[0].toUpperCase() + a.ability.name.slice(1)).join(", "),
					inline: true
				},
				{
					name: "Types",
					value: pokemon.types.map(a => a.type.name[0].toUpperCase() + a.type.name.slice(1)).join(", "),
					inline: true
				}
			])

		interaction.reply({ embeds: [embed] });
	}
}