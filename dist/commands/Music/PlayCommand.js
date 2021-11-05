"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.test = exports.data = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const Queue_1 = __importDefault(require("../../classes/Queue"));
const Utils_1 = require("../../utils/Utils");
const VoiceUtils_1 = require("../../utils/VoiceUtils");
exports.data = {
    name: 'play',
    description: 'Add a song to the queue.',
    options: [
        {
            type: 'STRING',
            name: 'song',
            description: 'Song name or url.',
            required: true
        }
    ]
};
exports.test = false;
const run = (client, interaction, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if ((yield client.botMusicManager.canUseCommand(client, interaction)) == false)
        return;
    const guildId = interaction.guildId;
    const member = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user.id));
    const channel = member.voice.channel;
    function playSong(song, connection, queue) {
        var _a, _b, _c;
        function getResource() {
            if (song.platform == "YouTube") {
                const stream = (0, ytdl_core_1.default)(song.url, { filter: 'audioonly', highWaterMark: 1048576 * 32 });
                return (0, voice_1.createAudioResource)(stream, { inputType: voice_1.StreamType.Arbitrary });
            }
            else {
                return (0, voice_1.createAudioResource)(song.streamUrl, { inputType: voice_1.StreamType.Arbitrary });
            }
        }
        const resource = getResource();
        // if (resource.playbackDuration == 0) {
        // 	if (queue.songs.length == 0) {
        // 		client.botMusicManager.disconnect(guildId);
        // 	}
        // 	return;
        // }
        const player = (0, voice_1.createAudioPlayer)();
        client.botMusicManager.addPlayer(guildId, player);
        player.play(resource);
        connection.subscribe(player);
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Now Playing')
            .setDescription(`[${song === null || song === void 0 ? void 0 : song.title}](${song === null || song === void 0 ? void 0 : song.url}) (${song === null || song === void 0 ? void 0 : song.platform})`)
            .setFooter(`Added by ${(_a = song === null || song === void 0 ? void 0 : song.addedBy) === null || _a === void 0 ? void 0 : _a.tag}`, (_b = song === null || song === void 0 ? void 0 : song.addedBy) === null || _b === void 0 ? void 0 : _b.avatarURL())
            .setColor('BLURPLE');
        if (song.thumbnail)
            embed.setThumbnail(song.thumbnail);
        (_c = queue.textChannel) === null || _c === void 0 ? void 0 : _c.send({ embeds: [embed], reply: undefined });
        player.on('stateChange', (oldState, newState) => {
            if (newState.status == voice_1.AudioPlayerStatus.Idle && oldState.status == voice_1.AudioPlayerStatus.Playing) {
                if (queue.loop == 'song') {
                    playSong(queue.songs[queue.playing], connection, queue);
                }
                else {
                    if (queue.songs[queue.playing + 1] != undefined) {
                        playSong(queue.songs[queue.playing + 1], connection, queue);
                        queue.playing++;
                    }
                    else if (queue.loop == 'queue') {
                        playSong(queue.songs[0], connection, queue);
                        queue.playing = 0;
                    }
                    else {
                        client.botMusicManager.disconnect(guildId);
                    }
                }
            }
        });
    }
    interaction.deferReply();
    // Create song
    const song = yield client.botMusicManager.songInfo(options.getString('song'), interaction.user);
    if (song == null) {
        interaction.followUp({ embeds: [(0, Utils_1.errorEmbed)('Could not play song.')] });
        return;
    }
    // Create queue if one doesn't exist
    if (client.botMusicManager.getQueue(guildId) == undefined) {
        const guild = yield client.guilds.fetch(guildId);
        const textChannel = yield guild.channels.fetch(interaction.channelId);
        const connection = (0, voice_1.joinVoiceChannel)({ channelId: channel.id, guildId: guildId, adapterCreator: (0, VoiceUtils_1.createDiscordJSAdapter)(channel) });
        const queue = new Queue_1.default(channel, textChannel, interaction.user);
        client.botMusicManager.addConnection(guildId, connection);
        client.botMusicManager.addQueue(guildId, queue);
        connection.on(voice_1.VoiceConnectionStatus.Ready, () => __awaiter(void 0, void 0, void 0, function* () {
            playSong(song, connection, queue);
        }));
        connection.on(voice_1.VoiceConnectionStatus.Disconnected, () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield Promise.race([
                    (0, voice_1.entersState)(connection, voice_1.VoiceConnectionStatus.Signalling, 5000),
                    (0, voice_1.entersState)(connection, voice_1.VoiceConnectionStatus.Connecting, 5000),
                ]);
            }
            catch (error) {
                client.botMusicManager.disconnect(guildId);
            }
        }));
        const embed = (0, Utils_1.simpleEmbed2)("Queue Created", "Succcessfuly joined the voice channel.");
        interaction.followUp({ embeds: [embed] });
    }
    else {
        const inQueue = client.botMusicManager.inQueue(guildId, song, interaction);
        if (inQueue == false) {
            const embed = new discord_js_1.MessageEmbed()
                .setTitle('Added Song to the Queue')
                .setDescription(`[${song === null || song === void 0 ? void 0 : song.title}](${song === null || song === void 0 ? void 0 : song.url}) (${song === null || song === void 0 ? void 0 : song.platform})`)
                .setFooter(`Added by ${(_b = song === null || song === void 0 ? void 0 : song.addedBy) === null || _b === void 0 ? void 0 : _b.tag}`, (_c = song === null || song === void 0 ? void 0 : song.addedBy) === null || _c === void 0 ? void 0 : _c.avatarURL())
                .setColor('BLURPLE');
            if ((song === null || song === void 0 ? void 0 : song.thumbnail) != null)
                embed.setThumbnail(song.thumbnail);
            interaction.followUp({ embeds: [embed] });
        }
        else
            return;
    }
    client.botMusicManager.addSong(guildId, song);
});
exports.run = run;
