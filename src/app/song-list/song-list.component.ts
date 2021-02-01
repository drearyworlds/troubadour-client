import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song';
import { StatusResponse } from '../../json-schema/statusResponse';
import { SongService } from '../song.service';
import { MessageService } from '../message.service';
import { isSuccess } from 'angular-in-memory-web-api';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
})
export class SongListComponent implements OnInit {
  songs?: Song[];
  success?: boolean;

  constructor(
    private songService: SongService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getSongList();
  }

  songComparator(song1: Song, song2: Song) {
    if (song1.artist.match("A ", )) {
      song1.artist = song1.artist.substring(2)
    } else if (song1.artist.match("An ", )) {
      song1.artist = song1.artist.substring(3)
    } else if (song1.artist.match("The ", )) {
      song1.artist = song1.artist.substring(4)
    }

    if (song2.artist.match("A ", )) {
      song2.artist = song2.artist.substring(2)
    } else if (song2.artist.match("An ", )) {
      song2.artist = song2.artist.substring(3)
    } else if (song2.artist.match("The ", )) {
      song2.artist = song2.artist.substring(4)
    }

    if (song1.artist == song2.artist) {
      if (song1.title == song2.title) {
        return 0;
      }
      if (song1.title < song2.title) {
        return -1;
      }
    } else if (song1.artist < song2.artist) {
      return -1;
    }

    return 1;
  }

  getSongList(): void {
    this.songService
      .getSongList()
      .subscribe(
        (songList) => (this.songs = songList.songs.sort(this.songComparator))
      );
  }

  songClicked(clickedSong: Song): void {
    console.log('I clicked a song');
    this.messageService.add(`Clicked a song: ${clickedSong.title}`);
    this.songService
      .setCurrentSong(clickedSong)
      .subscribe((response) => (this.success = response.success));

    //TODO: Figure out why success doesn't return true
    // this.messageService.add(`Success: ${this.success}`)
  }
}
