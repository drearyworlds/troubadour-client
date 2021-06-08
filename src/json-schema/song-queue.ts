import { Song } from './song'

interface SongRequest {
    id: number;
    name: string;
}

export interface QueueEntry {
    id: number;
    song: Song;
    position: number;
    requests: SongRequest;
}

export interface SongQueue {
    list: QueueEntry[];
}