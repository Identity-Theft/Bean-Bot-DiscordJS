import { CommandInteraction, CommandInteractionOptionResolver, Collection, SlashCommandBuilder, SlashCommandSubcommandBuilder, ChannelType } from "discord.js";
import fs from "fs";
import ExtendedClient from "../../structures/ExtendedClient";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";
import { CommandCategory, ICommand } from "../../structures/interfaces/ICommand";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import MusicManager from "../../structures/music/MusicManager";

export default class MusicCommand implements ICommand
{
	public data = new SlashCommandBuilder()
		.setName("music")
		.setDescription("Play music in vc");

	public category = CommandCategory.Music;

	private subcommands: Collection<string, ISubcommand> = new Collection();

	public constructor()
	{
		const dir = `${__dirname}/../../subcommands/music/`;
		const commandFiles = fs.readdirSync(dir);

		commandFiles.map(async (file: string) => {
			const command: ISubcommand = new (await import(dir + file)).default();

			this.subcommands.set(command.data.name, command);

			if (command.data instanceof SlashCommandSubcommandBuilder)
				this.data.addSubcommand(command.data);
			else
				this.data.addSubcommandGroup(command.data);
		});
	}

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
		const subcommand = args.getSubcommandGroup() || args.getSubcommand();
		const musicManager: MusicManager = client.musicManager;

		// Check if command can be used
		const guildId = interaction.guildId!;
		const member = await interaction.guild?.members.fetch(interaction.user.id);
		const channel = member!.voice.channel;

		if (!channel)
		{
			interaction.reply({ embeds: [new ErrorEmbed("You are not in a voice channel")], ephemeral: true });
			return;
		}

		if (musicManager.queues.get(guildId)?.voiceChannel.type == ChannelType.GuildStageVoice && !member?.permissions.has("Administrator"))
		{
			interaction.reply({ embeds: [new ErrorEmbed("Only admins can use music commands when Bean Bot is in a Stage Channel.")] });
			return;
		}

		if (musicManager.queues.get(guildId) != undefined && musicManager.queues.get(guildId)!.voiceChannel != channel)
		{
			interaction.reply({ embeds: [new ErrorEmbed("You are not in a voice channel with Bean Bot.")], ephemeral: true});
			return;
		}

		if (subcommand != "play")
		{
			if (musicManager.queues.get(guildId) == undefined)
			{
				interaction.reply({ embeds: [new ErrorEmbed("No queue exists")] });
				return;
			}
		}
		else
		{
			if (channel.type == ChannelType.GuildStageVoice && !interaction.memberPermissions?.has("Administrator"))
			{
				interaction.reply({ embeds: [new ErrorEmbed(`Only admins can add Bean Bot to Stage Channels. ${channel}`)], ephemeral: true });
				return;
			}
		}

		// Find subcommand
		const command = this.subcommands.get(subcommand);

		if (!command) {
			interaction.reply({ embeds: [new ErrorEmbed(`Command \`/${subcommand}\` doesn't exist or couldn't be loaded.`)] });
			return;
		}

		command.execute(client, interaction, args);
	}
}