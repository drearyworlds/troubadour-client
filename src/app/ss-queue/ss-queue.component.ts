import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SsQueueEntry, SsSong } from '../../json-schema/ss-objects'
import { Song } from '../../json-schema/song'
import { StatusResponse } from '../../json-schema/statusResponse'
import { MessageService } from '../message.service';
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
    private messageService: MessageService,
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
        this.songs = songList.songs.sort(songComparator);
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

  setAsCurrent(ssSong: SsSong): void {
    let song = this.getSongFromSsSong(ssSong);
    this.logVerbose(`Setting song as current: ${song.title}`);
    this.songService
      .setCurrentSong(song)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.logSuccess(`Current song set to: ${song.title}`)
      });
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