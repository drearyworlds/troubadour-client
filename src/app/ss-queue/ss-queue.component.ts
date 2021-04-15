import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SsQueueEntry, SsSong } from '../../json-schema/ss-objects'
import { Song } from '../../json-schema/song'
import { MessageService } from '../message.service';
import { SsService } from '../ss.service';
import { SongService } from '../song.service'

@Component({
  selector: 'app-ss-queue',
  templateUrl: './ss-queue.component.html',
  styleUrls: ['./ss-queue.component.css'],
})
export class SsQueueComponent implements OnInit {
  entries?: SsQueueEntry[];
  songs?: Song[];
  success?: boolean;

  constructor(
    private ssService: SsService,
    private songService: SongService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSongQueue();
    this.getSongList()
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
    if (song1 && song2) {
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
    } else {
      this.logFailure("Could not compare null songs")
    }

    return 1;
  }

  getSongQueue(): void {
    this.ssService
      .getSongQueue()
      .subscribe(
        (songQueue) => {
          this.entries = songQueue.list.sort(x => x.position)
          this.logSuccess('Fetched song queue');
        }
      );
  }

  getSongList(): void {
    this.songService
      .getList()
      .subscribe((songList) => {
        this.songs = songList.songs.sort(this.songComparator);
        this.logSuccess('Fetched song list');
      });
  }

  getSongFromSsSong(ssSong: SsSong): Song {
    let returnSong: Song = new Song();

    if (this.songs) {
      this.logVerbose(`getSongFromSsSong`);

      if (this.songs.length > 0) {
        for (let song of this.songs) {
          if (ssSong.artist == song.artist
            && ssSong.title == song.title) {
            this.logVerbose(`Matched song: ${song.title}`);
            returnSong = song;
            break;
          }
        }

        if (returnSong.id == 0) {
          this.logFailure(`Did not find matching song for: ${ssSong.artist} - ${ssSong.title}`)
        }
      } else {
        this.logFailure("songs has no entries")
      }
    }

    return returnSong;
  }

  setAsCurrent(entry: SsQueueEntry) {
    entry
  }

  markAsPlayed(entry: SsQueueEntry) {
    this.ssService
      .markAsPlayed(entry)
      .subscribe(
        () => {
          this.logSuccess('Entry marked as played');
          this.getSongQueue();
        }
      );
  }

  removeFromQueue(entry: SsQueueEntry) {
    this.ssService
      .removeFromQueue(entry)
      .subscribe(
        () => {
          this.logSuccess('Entry removed from queue');
          this.getSongQueue();
        }
      );
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