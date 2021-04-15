import { Song } from "./song";

export class SsSong {
    id: number = 0;
    artist: string = "";
    title: string = "";
    album: string = "";
    year: number = 0;
    capo: number = 0;
    active: boolean = false;
    comment: string = "";
    lyrics: string = "";
    chords: string = "";
    tab: string = "";
}

export interface SsSongList {
    items: SsSong[];
}

interface SsRequest {
    id: number;
    name: string;
}

export interface SsQueueEntry {
    id : number;
    song: SsSong;
    position: number;
    requests: SsRequest[];
}

export interface SsQueue {
    list: SsQueueEntry[];
}