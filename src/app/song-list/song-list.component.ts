import { Component, OnInit } from '@angular/core';
import { Song } from '../song'
import { SONGS } from '../mock-songs';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})

export class SongListComponent implements OnInit {
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