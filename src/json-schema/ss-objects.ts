export interface SsSong {
    artist: string;
    title: string;
    album: string;
    year: number;
    capo: number;
    active: boolean;
    comment: string;
    lyrics: string;
    chords: string;
    tab: string;
}

interface SsRequest {
    name: string;
}

export interface SsQueueEntry {
    song: SsSong;
    position: number;
    requests: SsRequest[];
}

export interface SsQueue {
    list: SsQueueEntry[];
}