import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SsQueueEntry, SsSong } from '../../json-schema/ss-objects'
import { Song } from '../../json-schema/song'
import { StatusResponse } from '../../json-schema/statusResponse'
import { LogService } from '../log.service';
import { SsService } from '../ss.service';
import { SongService } from '../song.service'
import { songComparator } from '../comparators'

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
    private logService: LogService,
  ) {
    this.logService.className = this.constructor.name;
  }

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

  getSongQueue(): void {
    this.ssService
      .getSongQueue()
      .subscribe(
        (songQueue) => {
          this.entries = songQueue.list.sort(x => x.position)
          this.logService.logSuccess('Fetched song queue');
        }
      );
  }

  getSongList(): void {
    this.songService
      .getList()
      .subscribe((songList) => {
        this.songs = songList.songs.sort(songComparator);
        this.logService.logSuccess('Fetched song list');
      });
  }

  getSongFromSsSong(ssSong: SsSong): Song {
    let returnSong: Song = new Song();

    if (this.songs) {
      this.logService.logVerbose(`getSongFromSsSong`);

      if (this.songs.length > 0) {
        for (let song of this.songs) {
          if (ssSong.artist == song.artist
            && ssSong.title == song.title) {
            this.logService.logVerbose(`Matched song: ${song.title}`);
            returnSong = song;
            break;
          }
        }

        if (returnSong.id == 0) {
          this.logService.logFailure(`Did not find matching song for: ${ssSong.artist} - ${ssSong.title}`)
        }
      } else {
        this.logService.logFailure("songs has no entries")
      }
    }

    return returnSong;
  }

  setAsCurrent(ssSong: SsSong): void {
    let song = this.getSongFromSsSong(ssSong);
    this.logService.logVerbose(`Setting song as current: ${song.title}`);
    this.songService
      .setCurrentSong(song)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.logService.logSuccess(`Current song set to: ${song.title}`)
      });
  }


  markAsPlayed(entry: SsQueueEntry) {
    this.ssService
      .markAsPlayed(entry)
      .subscribe(
        () => {
          this.logService.logSuccess('Entry marked as played');
          this.getSongQueue();
        }
      );
  }

  removeFromQueue(entry: SsQueueEntry) {
    this.ssService
      .removeFromQueue(entry)
      .subscribe(
        () => {
          this.logService.logSuccess('Entry removed from queue');
          this.getSongQueue();
        }
      );
  }
}