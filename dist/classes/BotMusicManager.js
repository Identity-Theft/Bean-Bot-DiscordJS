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
const yt_search_1 = __importDefault(require("yt-search"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const got_1 = __importDefault(require("got"));
const Song_1 = __importDefault(require("./Song"));
const Utils_1 = require("../utils/Utils");
class BotMusicManger {
    constructor() {
        this.queues = new Map();
        this.connections = new Map();
        this.audioPlayers = new Map();
    }
    canUseCommand(client, interaction) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const guildId = interaction.guildId;
            const member = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user.id));
            const channel = member.voice.channel;
            if (channel == null) {
                interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('You are not in a voice channel')], ephemeral: true });
                return false;
            }
            if (((_c = (_b = this.getQueue(guildId)) === null || _b === void 0 ? void 0 : _b.voiceChannel) === null || _c === void 0 ? void 0 : _c.type) == 'GUILD_STAGE_VOICE' && !(member === null || member === void 0 ? void 0 : member.permissions.has('ADMINISTRATOR'))) {
                interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('Only admins can use music commands when Bean Bot is in a Stage Channel.')] });
                return false;
            }
            if (this.getQueue(guildId) != undefined && this.getQueue(guildId).voiceChannel != channel) {
                interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('You are not in a voice channel with Bean Bot.')], ephemeral: true });
                return false;
            }
            if (interaction.commandName != 'play') {
                if (this.getQueue(guildId) == undefined) {
                    interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('Bean Bot is not in a Voice Channel.')] });
                    return false;
                }
            }
            else {
                if (channel.type == 'GUILD_VOICE' && !((_d = interaction.memberPermissions) === null || _d === void 0 ? void 0 : _d.has('ADMINISTRATOR'))) {
                    interaction.reply({ embeds: [(0, Utils_1.errorEmbed)(`Only admins can add Bean Bot to Stage Channels. ${channel}`)], ephemeral: true });
                    return false;
                }
            }
            return true;
        });
    }
    addQueue(guildId, queue) {
        this.queues.set(guildId, queue);
    }
    addConnection(guildId, connection) {
        this.connections.set(guildId, connection);
    }
    addPlayer(guildId, audioPlayer) {
        this.audioPlayers.set(guildId, audioPlayer);
    }
    addSong(guildId, song) {
        var _a;
        const songs = (_a = this.queues.get(guildId)) === null || _a === void 0 ? void 0 : _a.songs;
        songs === null || songs === void 0 ? void 0 : songs.push(song);
    }
    getConnection(guildId) {
        return this.connections.get(guildId);
    }
    getQueue(guildId) {
        return this.queues.get(guildId);
    }
    getPlayer(guildId) {
        return this.audioPlayers.get(guildId);
    }
    disconnect(guildId) {
        var _a;
        (_a = this.connections.get(guildId)) === null || _a === void 0 ? void 0 : _a.destroy();
        this.connections.delete(guildId);
        this.queues.delete(guildId);
    }
    inQueue(guildId, song, interaction) {
        const queue = this.getQueue(guildId);
        for (let i = 0; i < queue.songs.length; i++) {
            const s = queue.songs[i];
            if (s.url == song.url) {
                const embed = (0, Utils_1.errorEmbed)("Song is already in the queue.");
                interaction.followUp({ embeds: [embed], ephemeral: true });
                return true;
            }
        }
        return false;
    }
    songInfo(url, addedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!url.startsWith('https://')) {
                const newUrl = yield this.findVideo(url);
                if (newUrl != null) {
                    const song = yield this.songInfo(newUrl, addedBy);
                    return song;
                }
                else
                    return null;
            }
            else {
                // Check if url is from youtube
                if (ytdl_core_1.default.validateURL(url) == true) {
                    const song = yield ytdl_core_1.default.getInfo(url);
                    return new Song_1.default(song.videoDetails.title, url, addedBy, 'YouTube', song.videoDetails.thumbnails[song.videoDetails.thumbnails.length - 1].url);
                }
                else {
                    // Check if url is from newgrounds
                    if (!url.toLowerCase().startsWith('https://newgrounds.com/audio/listen/') && !url.toLowerCase().startsWith('https://www.newgrounds.com/audio/listen/'))
                        return null;
                    const urlParts = url.split('/');
                    const id = urlParts[urlParts.length - 1];
                    const data = yield (0, got_1.default)(`https://newgrounds.com/audio/feed/${id}`).json();
                    return new Song_1.default(data.title, url, addedBy, 'Newgrounds', data.icons.small, data.stream_url.split('?')[0]);
                }
            }
        });
    }
    findVideo(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, yt_search_1.default)(search);
            if (result)
                return result.videos[0].url;
            else
                return null;
        });
    }
}
exports.default = BotMusicManger;
