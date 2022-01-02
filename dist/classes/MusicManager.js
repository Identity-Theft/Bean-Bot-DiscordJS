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
const ytpl_1 = __importDefault(require("ytpl"));
const Song_1 = __importDefault(require("./Song"));
const Utils_1 = require("../utils/Utils");
class MusicManager {
    constructor() {
        this.queues = new Map();
        this.connections = new Map();
        this.audioPlayers = new Map();
    }
    canUseCommand(client, interaction) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const guildId = interaction.guildId;
            const member = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user.id));
            const channel = member.voice.channel;
            if (channel == null) {
                interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('You are not in a voice channel')], ephemeral: true });
                return false;
            }
            if (((_b = this.queues.get(guildId)) === null || _b === void 0 ? void 0 : _b.voiceChannel.type) == 'GUILD_STAGE_VOICE' && !(member === null || member === void 0 ? void 0 : member.permissions.has('ADMINISTRATOR'))) {
                interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('Only admins can use music commands when Bean Bot is in a Stage Channel.')] });
                return false;
            }
            if (this.queues.get(guildId) != undefined && this.queues.get(guildId).voiceChannel != channel) {
                interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('You are not in a voice channel with Bean Bot.')], ephemeral: true });
                return false;
            }
            if (interaction.commandName != 'play') {
                if (this.queues.get(guildId) == undefined) {
                    interaction.reply({ embeds: [(0, Utils_1.errorEmbed)('Bean Bot is not in a Voice Channel.')] });
                    return false;
                }
            }
            else {
                if (channel.type == 'GUILD_STAGE_VOICE' && !((_c = interaction.memberPermissions) === null || _c === void 0 ? void 0 : _c.has('ADMINISTRATOR'))) {
                    interaction.reply({ embeds: [(0, Utils_1.errorEmbed)(`Only admins can add Bean Bot to Stage Channels. ${channel}`)], ephemeral: true });
                    return false;
                }
            }
            return true;
        });
    }
    addSong(guildId, song) {
        var _a;
        const songs = (_a = this.queues.get(guildId)) === null || _a === void 0 ? void 0 : _a.songs;
        songs === null || songs === void 0 ? void 0 : songs.push(song);
    }
    disconnect(guildId) {
        var _a;
        (_a = this.connections.get(guildId)) === null || _a === void 0 ? void 0 : _a.destroy();
        this.connections.delete(guildId);
        this.queues.delete(guildId);
    }
    inQueue(guildId, song) {
        const queue = this.queues.get(guildId);
        for (let i = 0; i < queue.songs.length; i++) {
            const s = queue.songs[i];
            if (s.url == song.url) {
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
                if (ytdl_core_1.default.validateURL(url)) {
                    // YouTube Url
                    const info = yield ytdl_core_1.default.getInfo(url);
                    if (!info.videoDetails.isLiveContent && !info.videoDetails.age_restricted) {
                        return new Song_1.default(info.videoDetails.title, info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url, info.videoDetails.lengthSeconds, isNaN(info.videoDetails.likes) ? 0 : info.videoDetails.likes, info.videoDetails.viewCount, info.videoDetails.video_url, addedBy);
                    }
                    else
                        return null;
                }
                else if (ytpl_1.default.validateID(url)) {
                    const playlist = yield (0, ytpl_1.default)(url);
                    const songs = [];
                    for (let index = 0; index < playlist.items.length; index++) {
                        const item = playlist.items[index];
                        const song = yield this.songInfo(item.url, addedBy);
                        songs.push(song);
                    }
                    return songs;
                }
                else
                    return null;
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
exports.default = MusicManager;
