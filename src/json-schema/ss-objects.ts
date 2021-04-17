import { Song } from "./song";

export class SsSong {
    constructor(song?: Song) {
        if (song) {
            this.active = song.active;
            this.artist = song.artist;
            this.comment = song.comment;
            this.title = song.title;
            this.tab = song.tab;
            this.chords = song.chords;
            this.lyrics = song.lyrics;
        }
    }

    id: number = 0;
    artist: string = "";
    title: string = "";
    active: boolean = false;
    comment: string = "";
    lyrics: string = "";
    chords: string = "";
    tab: string = "";
    attributes: AttributeEntity[] = [];
}

class AttributeEntity {
}

export interface SsSongList {
    items: SsSong[];
}

interface SsRequest {
    id: number;
    name: string;
}

export interface SsQueueEntry {
    id: number;
    song: SsSong;
    position: number;
    requests: SsRequest[];
}

export interface SsQueue {
    list: SsQueueEntry[];
}