import { VoiceState } from "discord.js";
import Bot from "../../classes/Bot";
import Event from "../../interfaces/Event";
import { simpleEmbed2 } from "../../utils/Utils";

export default class VoiceStateUpdateEvent implements Event
{
	public name = "voiceStateUpdate";
	public async run(client: Bot, oldState: VoiceState, newState: VoiceState): Promise<void>
	{
		const queue = client.musicManager.queues.get(oldState.guild.id);

		if (oldState.member?.user == client.user)
		{
			if (queue != undefined && oldState.channelId != null && newState.channel == null)
			{
				const embed = simpleEmbed2("Disconnected", `Bean Bot has been kicked from ${queue.voiceChannel}.`);
				queue.textChannel.send({ embeds: [embed] });

				client.musicManager.disconnect(oldState.guild.id);
			}

			if (queue != undefined && oldState.channelId != null && newState.channel != null && newState.channel.members.size == 1)
			{
				const embed = simpleEmbed2("Disconnected", `Bean Bot left ${queue.voiceChannel} because no one else was in the Voice Channel.`);
				queue.textChannel.send({ embeds: [embed] });

				client.musicManager.disconnect(oldState.guild.id);
			}
			else if (queue != undefined && newState.channel != null && newState.channel.members.size > 1)
			{
				queue.voiceChannel = newState.channel;
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
}