import { joinVoiceChannel } from "@discordjs/voice";
import { VoiceState } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Event";
import { simpleEmbed2 } from "../../utils/Utils";
import { createDiscordJSAdapter } from "../../utils/VoiceUtils";

export const name = 'voiceStateUpdate';

export const run: RunFunction = async (client: Bot, oldState: VoiceState, newState: VoiceState) => {
	const queue = client.musicManager.getQueue(oldState.guild.id);

	if (oldState.member?.user == client.user)
	{
		if (queue != undefined && oldState.channelId != null && oldState.channel != null && newState.channel != queue.voiceChannel)
		{
			joinVoiceChannel({ channelId: oldState.channelId, guildId: oldState.guild.id, adapterCreator: createDiscordJSAdapter(oldState.channel) });
		}
	}
	else
	{
		if (queue != undefined && oldState.channel == queue.voiceChannel && oldState.channel?.members.size == 1)
		{
			const embed = simpleEmbed2("Disconnected", `Bean Bot left ${queue.voiceChannel} because no one else was in the Voice Channel.`);
			queue.textChannel.send({ embeds: [embed] });

			client.musicManager.disconnect(oldState.guild.id);
		}
	}
}