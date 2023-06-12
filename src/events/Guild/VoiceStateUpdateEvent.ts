import { ClientEvents, VoiceState } from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { BotEmbed } from "../../structures/ExtendedEmbeds";
import IEvent from "../../structures/interfaces/IEvent";

export default class VoiceStateUpdateEvent implements IEvent
{
	public name: keyof ClientEvents = "voiceStateUpdate";
	public async execute(client: ExtendedClient, oldState: VoiceState, newState: VoiceState): Promise<void>
	{
		const queue = client.musicManager.queues.get(oldState.guild.id);

		if (oldState.member?.user == client.user)
		{
			if (queue != undefined && oldState.channelId != null && newState.channel == null)
			{
				const embed = new BotEmbed()
					.setDescription(`The queue has been cleared: \`The bot has been kicked from ${queue.voiceChannel}\``);

				queue.textChannel.send({ embeds: [embed] });
				queue.destroy();
			}

			// If bot gets moved but there's no one in that vc
			if (queue != undefined && oldState.channelId != null && newState.channel != null && newState.channel.members.size == 1)
			{
				const embed = new BotEmbed()
					.setDescription(`The queue has been cleared: \`There was no one in the Voice Channel\``);

				queue.textChannel.send({ embeds: [embed] });
				queue.destroy();
			}
			else if (queue != undefined && newState.channel != null && newState.channel.members.size > 1)
			{
				queue.voiceChannel = newState.channel;
			}
		}
		else
		{
			// If user leaves vc and bot is the only user left
			if (queue != undefined && oldState.channel == queue.voiceChannel && oldState.channel?.members.size == 1)
			{
				const embed = new BotEmbed()
					.setDescription(`The queue has been cleared: \`There was no one in the Voice Channel\``);

				queue.textChannel.send({ embeds: [embed] });
				queue.destroy();
			}
		}
	}
}