import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song';
import { StatusResponse } from '../../json-schema/statusResponse';
import { SongService } from '../song.service';
import { MessageService } from '../message.service';

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
  ) { }

  ngOnInit(): void {
    this.getSongList();
  }

  getHeaderRowDivClass() {
    return {
      'rowHeader': true
    }
  }

  getRowDivClass(active: boolean) {
    return {
      'rowActive': active,
      'rowInactive': !active
    }
  }

  getHeaderCellDivClass(fixed : boolean) {
    return {
      'cellHeader': true,
      'cellFixedWidth': fixed
    }
  }

  getCellDivClass(active: boolean, fixed : boolean) {
    return {
      'cellActive': active,
      'cellInactive': !active,
      'cellFixedWidth': fixed
    }
  }

  songComparator(song1: Song, song2: Song) {
    let song1SortArtist = song1.artist;
    let song2SortArtist = song2.artist;
    let song1SortTitle = song1.title;
    let song2SortTitle = song2.title;

    // Put active songs above inactive songs
    if (song1.active != song2.active) {
      return song1.active ? -1 : 1;
    }

    if (song1SortArtist.match("A ",)) {
      song1SortArtist = song1SortArtist.substring(2)
    } else if (song1SortArtist.match("An ",)) {
      song1SortArtist = song1SortArtist.substring(3)
    } else if (song1SortArtist.match("The ",)) {
      song1SortArtist = song1SortArtist.substring(4)
    }

    if (song2SortArtist.match("A ",)) {
      song2SortArtist = song2SortArtist.substring(2)
    } else if (song2SortArtist.match("An ",)) {
      song2SortArtist = song2SortArtist.substring(3)
    } else if (song2SortArtist.match("The ",)) {
      song2SortArtist = song2SortArtist.substring(4)
    }

    if (song1SortArtist == song2SortArtist) {
      if (song1SortTitle == song2SortTitle) {
        return 0;
      }
      if (song1SortTitle < song2SortTitle) {
        return -1;
      }
    } else if (song1SortArtist < song2SortArtist) {
      return -1;
    }

    return 1;
  }

  getSongList(): void {
    this.songService
      .getList()
      .subscribe(
        (songList) => (this.songs = songList.songs.sort(this.songComparator))
      );
  }

  songClicked(clickedSong: Song): void {
    this.messageService.add(`Clicked a song: ${clickedSong.title}`);
    this.songService
      .setCurrent(clickedSong)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.messageService.add(`Success: ${this.success}`)
      });
  }
}
