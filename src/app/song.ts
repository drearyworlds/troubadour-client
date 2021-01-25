export interface Song {
    id?: number;
    artist: string;
    title: string;
    album: string;
    year: number;
    capo: number;
    tuning: string;
    pick: boolean;
    active: boolean;
  }