"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NewgroundsResponse {
    constructor() {
        this.id = 0;
        this.title = '';
        this.download_url = '';
        this.stream_url = '';
        this.filesize = 0;
        this.icons = new Icons();
        this.authors = [];
        this.has_scouts = false;
        this.unpublished = false;
        this.allow_downloads = false;
        this.has_valid_portal_member = false;
        this.allow_external_api = false;
    }
}
class Author {
    constructor() {
        this.id = '';
        this.name = '';
        this.url = '';
        this.icons = new Icons();
        this.owner = 0;
        this.manager = 0;
        this.is_scout = true;
    }
}
class Icons {
    constructor() {
        this.small = '';
        this.medium = '';
        this.large = '';
    }
}
exports.default = NewgroundsResponse;
