import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Song } from './song';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const songs = [
      {
        id: 1,
        title: 'Doing the Unstuck',
        artist: 'The Cure',
        album: 'Wish',
        year: 1992,
        active: true
    },{
        id: 2,
        title: 'Friday, I\'m in Love',
        artist: 'The Cure',
        album: 'Wish',
        year: 1992,
        active: true
    }
    ];
    return {songs};
  }

  // Overrides the genId method to ensure that a song always has an id.
  // If the songs array is empty,
  // the method below returns the initial number (11).
  // if the songs array is not empty, the method below returns the highest
  // song id + 1.
  genId(songs: Song[]): number {
    return songs.length > 0 ? Math.max(...songs.map(song => song.id)) + 1 : 11;
  }
}