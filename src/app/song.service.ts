import { Injectable } from '@angular/core';
import { Song } from './song';
import { SONGS } from './mock-songs';

@Injectable({
  providedIn: 'root'
})

export class SongService {
  constructor() { }

  getSongs(): Song[] {
    return SONGS;
  }
}