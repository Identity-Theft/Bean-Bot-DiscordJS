import { VoiceState } from "discord.js";
import Bot from "../../classes/Bot";
import { RunFunction } from "../../interfaces/Event";

export const name = 'voiceStateUpdate';

export const run: RunFunction = async (client: Bot, oldState: VoiceState, newState: VoiceState) => {
	const queue = client.botMusicManager.getQueue(oldState.guild.id);

	if (queue != undefined && newState.channel != queue.voiceChannel && newState.channel != null)
		queue.voiceChannel == newState.channel;
}