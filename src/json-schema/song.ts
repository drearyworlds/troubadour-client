export class Song {
    // Internal IDs
    public id: number = 0;
    ssId: number = 0;

    // About the song
    artist: string = "";
    featuring: string = "";
    composer : string = "";
    album: string = "";
    title: string = "";
    year: number = 0;
    artistPopularity: number = 0;

    // How to play
    capo: number = 0;
    tuning: string = "Standard";
    pick: boolean = true;
    lyrics: string = "";
    chords: string = "";
    tab: string = "";
    difficulty: number = 10;

    // Status
    active: boolean = false;
    isNew: boolean = false;
    suggestedBy: string = "drearyworlds";
    requestedBy: string = "drearyworlds";

    // History
    dateAdded: Date = new Date();
    datePlayed: Date = new Date();
    playCount: Date = new Date();
}