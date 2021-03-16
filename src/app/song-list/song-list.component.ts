import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song';
import { SongService } from '../song.service';
import { SsService } from '../ss.service';
import { StatusResponse } from '../../json-schema/statusResponse';
import { MessageService } from '../message.service';
import { SsSong, SsQueueEntry } from '../../json-schema/ss-objects'
import { SongList } from 'src/json-schema/song-list';


@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
})
export class SongListComponent implements OnInit {
  songs?: Song[];
  success?: boolean;
  fileName?: string;

  constructor(
    private songService: SongService,
    private messageService: MessageService,
    private ssService: SsService
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

  getHeaderCellDivClass(fixed: boolean) {
    return {
      'cellHeader': true,
      'cellFixedWidth': fixed
    }
  }

  getCellDivClass(active: boolean, fixed: boolean) {
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


  GetSsSongFromSong(song: Song): SsSong {
    this.logVerbose(`GetQueueEntryFromSong`);
    let songList: Array<SsSong> = new Array<SsSong>();

    this.ssService.getSongList()
      .subscribe((songList: Array<SsSong>) => {
        songList = songList;
      });

    this.logVerbose(`got songlist`);
    let returnSsSong: SsSong = songList[0]
    
    if (songList.entries.length > 0) {
      songList.forEach((ssSong: SsSong) => {
        this.logVerbose(`foreach loop: ${ssSong.title}`);
        if (song.artist == ssSong.artist
          && song.title == ssSong.title) {
          returnSsSong = ssSong;
        }
      });

      this.logVerbose(`Returning`);
    } else {
      this.logVerbose("Queue has no entries")
    }

    return returnSsSong;
  }

  GetSongFromssSong(ssSong: SsSong): Song {
    let songs: Array<Song> = new Array<Song>();

    this.songService.getList()
      .subscribe((list: SongList) => {
        songs = list.songs;
      });

    let returnSong: Song = songs[0];
    songs.forEach((song: Song) => {
      if (ssSong.artist == song.artist
        && ssSong.title == song.title) {
        returnSong = song;
      }
    });

    return returnSong;
  }

  getSongList(): void {
    this.songService
      .getList()
      .subscribe((songList) => {
        this.songs = songList.songs.sort(this.songComparator);
        this.logSuccess('Fetched song list');
      });
  }

  setAsCurrent(songToSet: Song): void {
    this.logVerbose(`Setting song as current: ${songToSet.title}`);
    this.songService
      .setCurrentSong(songToSet)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.logSuccess(`Current song set to: ${songToSet.title}`)
      });
  }

  addToQueue(song: Song) {
    this.logVerbose('addToQueue');
    let ssSong: SsSong = this.GetSsSongFromSong(song);

    // this.logVerbose(`entry: ${ssSong.title}`);
    // this.ssService
    //   .addToQueue(ssSong)
    //   .subscribe(
    //     () => {
    //       this.logSuccess('Entry added to queue');
    //     }
    //   );

    this.logVerbose('addToQueue');
  }

  private logFailure(message: string) {
    this.messageService.logFailure(message, this.constructor.name);
  }

  private logSuccess(message: string) {
    this.messageService.logSuccess(message, this.constructor.name);
  }

  private logInfo(message: string) {
    this.messageService.logInfo(message, this.constructor.name);
  }

  private logVerbose(message: string) {
    this.messageService.logVerbose(message, this.constructor.name);
  }
}
