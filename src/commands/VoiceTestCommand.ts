import { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { Bot } from "../client/Client";
import { RunFunction } from "../interfaces/Command";
import { errorEmbed } from "../utils/Utils";
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { createDiscordJSAdapter } from "../utils/Voice";

export const data: ApplicationCommandData = {
	name: 'voice-test',
	description: 'Voice test',
	options: [
		{
			type: 'SUB_COMMAND',
			name: 'join',
			description: 'Join voice.',
			options: [
				{
					type: 'CHANNEL',
					name: 'vc',
					description: 'Voice Channel',
					required: true
				},
			]
		},
		{
			type: 'SUB_COMMAND',
			name: 'leave',
			description: 'Leave voice',
		}
	]
}
export const test = true;

export const run: RunFunction = async(client: Bot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
	const guildId = interaction.guildId!;

	switch(options.getSubcommand())
	{
	case 'join':
		const channel = options.getChannel('vc')!;

		if (channel.type != 'GUILD_VOICE') {
			interaction.reply({ embeds: [errorEmbed('`vc` must be a Voice Channel!')], ephemeral: true });
			return;
		}

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: guildId,
			adapterCreator: createDiscordJSAdapter(channel),
		})

		connection.on(VoiceConnectionStatus.Disconnected, async () => {
			try {
				await Promise.race([
					entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
					entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
				]);
				// Seems to be reconnecting to a new channel - ignore disconnect
			} catch (error) {
				// Seems to be a real disconnect which SHOULDN'T be recovered from
				connection.destroy();
				client.connections.delete(guildId);
			}
		});

		client.connections.set(guildId, connection);
		interaction.reply({ content: `Succsessfully joined ${channel}`, ephemeral: true });
		break;
	case 'leave':
		if (client.connections.get(guildId)) {
			client.connections.get(guildId)?.destroy();
			client.connections.delete(guildId);

			interaction.reply({ content: ':thumbsup:', ephemeral: true });
		}
		break;
	}
}