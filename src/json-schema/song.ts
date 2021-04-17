import { SsSong } from './ss-objects'

export class Song {
    id: number = 0;
    artist: string = "";
    album: string = "";
    title: string = "";
    active: boolean = false;
    comment: string = "";
    lyrics: string = "";
    chords: string = "";
    tab: string = "";
    year: number = 0;
    capo: number = 0;
    tuning: string = "Standard";
    pick: boolean = true;
    composer : string = "";
    suggestedBy: string = "drearyworlds";
}