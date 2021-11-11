"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../utils/Utils");
class Song {
    constructor(title, thumbnail, duration, likes, views, url, addedBy) {
        this.duration = "";
        this.fortmatedDuration = "";
        this.title = title;
        this.thumbnail = thumbnail;
        this.duration = duration;
        this.likes = likes;
        this.views = views;
        this.fortmatedDuration = (0, Utils_1.formatDuration)(parseInt(duration));
        this.url = url;
        this.addedBy = addedBy;
    }
}
exports.default = Song;
