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