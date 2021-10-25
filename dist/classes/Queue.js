"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor(voiceChannel, textChannel, startedBy) {
        this.voiceChannel = null;
        this.textChannel = null;
        this.startedBy = null;
        this.loop = 'none';
        this.playing = 0;
        this.songs = [];
        this.voiceChannel = voiceChannel,
            this.textChannel = textChannel,
            this.startedBy = startedBy;
    }
}
exports.default = Queue;
