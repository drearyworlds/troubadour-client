import { Component, OnInit } from '@angular/core';
import { Song } from '../song'
import { SONGS } from '../mock-songs';
import { SongService } from '../song.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})

export class SongListComponent implements OnInit {
  songs? : Song[]

  selectedSong?: Song

  constructor(private songService: SongService) {
  }

  ngOnInit(): void {
    this.getSongs();
  }

  getSongs(): void {
    this.songService.getSongs()
      .subscribe(songs => this.songs = songs);

    if (this.songs) {
      this.selectedSong = this.songs.find((song) => {
        return song.id == 0;
      });  
    }
  }

  onSelect(song: Song): void {
    this.selectedSong = song;
  }
}