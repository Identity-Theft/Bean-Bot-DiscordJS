import { createAudioPlayer, DiscordGatewayAdapterCreator, entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandAttachmentOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, TextChannel } from "discord.js";
import Queue from "../../structures/music/Queue";
import Track from "../../structures/music/Track";
import ExtendedClient from "../../structures/ExtendedClient";
import ISubcommand from "../../structures/interfaces/ISubcommand";
import { ErrorEmbed } from "../../structures/ExtendedEmbeds";
import Playlist from "../../structures/music/Playlist";

export default class PlayCommand implements ISubcommand
{
	public data = new SlashCommandSubcommandGroupBuilder()
		.setName("play")
		.setDescription("Queue a track or playlist from a search term, URL or file.")
		.addSubcommand(new SlashCommandSubcommandBuilder()
			.setName("file")
			.setDescription("Queue a track from a Video or Audio file.")
			.addAttachmentOption(new SlashCommandAttachmentOption()
				.setName("track")
				.setDescription("Video or Audio file.")
				.setRequired(true)
			)
		)
		.addSubcommand(new SlashCommandSubcommandBuilder()
			.setName("search")
			.setDescription("Queue a track or playlist from a search term.")
			.addStringOption(new SlashCommandStringOption()
				.setName("name")
				.setDescription("Name of track to search for.")
				.setRequired(true)
			)
			.addStringOption(new SlashCommandStringOption()
				.setName("platform")
				.setDescription("Platform to search from.")
				.addChoices({name: "youtube", value: "youtube"}, {name: "spotify", value: "spotify"})
				.setRequired(true)
			)
		)
		.addSubcommand(new SlashCommandSubcommandBuilder()
			.setName("url")
			.setDescription("Queue a track or playlist from a URL.")
			.addStringOption(new SlashCommandStringOption()
				.setName("track")
				.setDescription("URL.")
				.setRequired(true)
			)
		)

	public async execute(client: ExtendedClient, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void>
	{
		const guildId = interaction.guildId!;
		const member = await interaction.guild?.members.fetch(interaction.user.id);
		const voiceChannel = member!.voice.channel!;

		await interaction.deferReply();

		// Create track
		const subcommand = args.getSubcommand();

		try {
			let result: Track | Playlist;

			if (subcommand == "search")
				result = await client.musicManager.trackFromSearch(args.getString("name")!, args.getString("platform")!, interaction.user);
			else
				result = await client.musicManager.trackFromUrl(subcommand == "url" ? args.getString("track")! : args.getAttachment("track")!, interaction.user);

			let queue = client.musicManager.queues.get(interaction.guildId!);

			// Create queue if one doesn't exist
			if (!queue)
			{
				const guild = await client.guilds.fetch(guildId);
				const textChannel = await guild.channels.fetch(interaction.channelId!);

				const connection = joinVoiceChannel({ channelId: voiceChannel.id, guildId: guildId, adapterCreator: guild.voiceAdapterCreator as DiscordGatewayAdapterCreator });
				const audioPlayer = createAudioPlayer();
				queue = new Queue(client.musicManager, interaction, voiceChannel, textChannel as TextChannel, audioPlayer);

				client.musicManager.queues.set(guildId, queue);

				connection.subscribe(audioPlayer);

				// Play tracks once the bot joins a vc
				connection.on(VoiceConnectionStatus.Ready, async () => {
					if (result instanceof Playlist)
						await queue!.playTrack(result.tracks[0]);
					else
						await queue!.playTrack(result);
				});

				// Handle disconnection
				connection.on(VoiceConnectionStatus.Disconnected, async () => {
					try {
						await Promise.race([
							entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
							entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
						]);
						// Seems to be reconnecting to a new channel - ignore disconnect
					} catch (error) {
						// Seems to be a real disconnect which SHOULDN'T be recovered from
						queue!.destroy();
					}
				});

				// Fixes playback stopping after a few seconds (it just shits itself instead)
				const networkStateChangeHandler = (oldNetworkState: any, newNetworkState: any) => {
					const newUdp = Reflect.get(newNetworkState, 'udp');
					clearInterval(newUdp?.keepAliveInterval);
				}

				connection.on('stateChange', (oldState, newState) => {
					Reflect.get(oldState, 'networking')?.off('stateChange', networkStateChangeHandler);
					Reflect.get(newState, 'networking')?.on('stateChange', networkStateChangeHandler);
				});
			}

			await queue.addTrack(result, interaction);
		} catch(error) {
			await interaction.followUp({ embeds: [new ErrorEmbed(error instanceof Error ? error.message : `${error}`)] });
		}
	}
}