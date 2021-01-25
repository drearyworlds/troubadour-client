import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Song } from './song';
import SongAndBeerList from '../../songAndBeerList.json';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const songs : Song[] = SongAndBeerList.songs
    
    // Assign indices
    songs.forEach(function(song, index){
      if (song.active) {
        // Assign the index as the ID
        song.id = index + 1;
      }
    });

    songs.sort((s1, s2) => {
      if (s1.artist < s2.artist) {
        return -1;
      } else if (s1.artist > s2.artist) {
        return 1;
      } else {
        return 0;
      }
    })

    return {songs};
  }
}