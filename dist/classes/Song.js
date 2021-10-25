"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Song {
    constructor(title, url, addedBy, platform, thumbnail, streamUrl) {
        this.title = '';
        this.thumbnail = null;
        this.url = '';
        this.streamUrl = '';
        this.addedBy = null;
        this.platform = '';
        this.title = title;
        this.url = url;
        this.addedBy = addedBy;
        this.platform = platform;
        if (streamUrl != undefined)
            this.streamUrl = streamUrl;
        if (thumbnail != undefined)
            this.thumbnail = thumbnail;
    }
}
exports.default = Song;
