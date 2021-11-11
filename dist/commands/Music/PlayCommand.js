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
const ytpl_1 = __importDefault(require("ytpl"));
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
    if ((yield client.musicManager.canUseCommand(client, interaction)) == false)
        return;
    const guildId = interaction.guildId;
    const member = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user.id));
    const channel = member.voice.channel;
    function playSong(song, connection, queue) {
        function getResource() {
            const stream = (0, ytdl_core_1.default)(song.url, { filter: 'audioonly', highWaterMark: 1048576 * 32 });
            return (0, voice_1.createAudioResource)(stream, { inputType: voice_1.StreamType.Arbitrary });
        }
        const resource = getResource();
        const player = (0, voice_1.createAudioPlayer)();
        client.musicManager.addPlayer(guildId, player);
        player.play(resource);
        connection.subscribe(player);
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Now Playing')
            .setDescription(`[${song === null || song === void 0 ? void 0 : song.title}](${song === null || song === void 0 ? void 0 : song.url})`)
            .setThumbnail(song.thumbnail)
            .setFooter(`Added by ${song === null || song === void 0 ? void 0 : song.addedBy.tag}`, song === null || song === void 0 ? void 0 : song.addedBy.avatarURL())
            .setColor('BLURPLE');
        queue.textChannel.send({ embeds: [embed], reply: undefined });
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
                        client.musicManager.disconnect(guildId);
                    }
                }
            }
        });
    }
    interaction.deferReply();
    // Create song
    const song = yield client.musicManager.songInfo(options.getString('song'), interaction.user);
    if (song == null) {
        interaction.followUp({ embeds: [(0, Utils_1.errorEmbed)('Could not play song.')] });
        return;
    }
    const songsToAdd = [];
    // Create queue if one doesn't exist
    if (client.musicManager.getQueue(guildId) == undefined) {
        const guild = yield client.guilds.fetch(guildId);
        const textChannel = yield guild.channels.fetch(interaction.channelId);
        const connection = (0, voice_1.joinVoiceChannel)({ channelId: channel.id, guildId: guildId, adapterCreator: (0, VoiceUtils_1.createDiscordJSAdapter)(channel) });
        const queue = new Queue_1.default(channel, textChannel, interaction.user);
        client.musicManager.addConnection(guildId, connection);
        client.musicManager.addQueue(guildId, queue);
        connection.on(voice_1.VoiceConnectionStatus.Ready, () => __awaiter(void 0, void 0, void 0, function* () {
            if (Array.isArray(song))
                playSong(song[0], connection, queue);
            else
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
                client.musicManager.disconnect(guildId);
            }
        }));
        const embed = (0, Utils_1.simpleEmbed2)("Queue Created", "Succcessfuly joined the voice channel.");
        interaction.followUp({ embeds: [embed] });
    }
    else {
        if (!Array.isArray(song)) {
            const inQueue = client.musicManager.inQueue(guildId, song);
            if (inQueue == false) {
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle('Added Song to the Queue')
                    .setDescription(`[${song === null || song === void 0 ? void 0 : song.title}](${song === null || song === void 0 ? void 0 : song.url})`)
                    .setThumbnail(song.thumbnail)
                    .setFooter(`Added by ${song === null || song === void 0 ? void 0 : song.addedBy.tag}`, song === null || song === void 0 ? void 0 : song.addedBy.avatarURL())
                    .setColor('BLURPLE');
                interaction.followUp({ embeds: [embed] });
            }
            else {
                const embed = (0, Utils_1.errorEmbed)("Song is already in the queue.");
                interaction.followUp({ embeds: [embed], ephemeral: true });
                return;
            }
            const queue = client.musicManager.getQueue(guildId);
            if (queue.songs.length == queue.maxSongs) {
                const embed = (0, Utils_1.errorEmbed)(`Cannot have more than ${queue.maxSongs} songs in a queue.`);
                interaction.followUp({ embeds: [embed] });
                return;
            }
        }
    }
    if (Array.isArray(song)) {
        for (let i = 0; i < song.length; i++) {
            const s = song[i];
            const inQueue = client.musicManager.inQueue(guildId, s);
            const queue = client.musicManager.getQueue(guildId);
            if (!inQueue && queue.songs.length < queue.maxSongs) {
                songsToAdd.push(s);
                client.musicManager.addSong(guildId, s);
            }
        }
        if (songsToAdd.length != 0) {
            const playlist = yield (0, ytpl_1.default)(options.getString("song"));
            const embed = new discord_js_1.MessageEmbed()
                .setTitle('Added Songs from Playlist')
                .setDescription(`[${playlist.title}](${playlist.url}) (${songsToAdd.length}/${playlist.items.length} songs added)`)
                .setFooter(`Added by ${(_b = song[0]) === null || _b === void 0 ? void 0 : _b.addedBy.tag}`, (_c = song[0]) === null || _c === void 0 ? void 0 : _c.addedBy.avatarURL())
                .setColor('BLURPLE');
            if (playlist.bestThumbnail.url != null)
                embed.setThumbnail(playlist.bestThumbnail.url);
            if (!interaction.replied)
                interaction.followUp({ embeds: [embed] });
            else {
                const queue = client.musicManager.getQueue(guildId);
                queue.textChannel.send({ embeds: [embed] });
            }
        }
        else {
            const embed = (0, Utils_1.errorEmbed)("Could not add any songs to the queue.");
            interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    }
    else
        client.musicManager.addSong(guildId, song);
});
exports.run = run;
