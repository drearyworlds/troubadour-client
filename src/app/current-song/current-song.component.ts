import { Component, OnInit } from '@angular/core';
import { Song } from '../song'
import { SONGS } from '../mock-songs';

@Component({
  selector: 'app-current-song',
  templateUrl: './current-song.component.html',
  styleUrls: ['./current-song.component.css']
})

export class CurrentSongComponent implements OnInit {
  songs = SONGS;

  constructor() { }

  ngOnInit(): void {
    // read JSON file and load songs
  }

  selectedSong?: Song = this.songs.find((song)=> {
    return song.id == 0;
  });

  onSelect(song: Song): void {
    this.selectedSong = song;
  }
}