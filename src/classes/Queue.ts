import { StageChannel, TextBasedChannels, User, VoiceChannel } from "discord.js";
import Song from "./Song";

class Queue {
	public voiceChannel: VoiceChannel | StageChannel | null = null;
	public textChannel: TextBasedChannels | null = null;
	public startedBy: User | null = null;
	public loop: 'none' | 'song' | 'queue' = 'none'
	public playing = 0;
	public songs: Array<Song> = [];

	public constructor(voiceChannel: VoiceChannel | StageChannel, textChannel: TextBasedChannels, startedBy: User) {
		this.voiceChannel = voiceChannel,
		this.textChannel = textChannel,
		this.startedBy = startedBy
	}
}

export default Queue;