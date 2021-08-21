import { Component, OnInit } from '@angular/core';
import { QueueEntry } from '../../json-schema/song-queue'
import { Song } from '../../json-schema/song'
import { StatusResponse } from '../../json-schema/statusResponse'
import { LogService, LogLevel } from '../log.service';
import { SongService } from '../song.service'

@Component({
  selector: 'app-song-queue',
  templateUrl: './song-queue.component.html',
  styleUrls: ['./song-queue.component.css'],
})
export class SongQueueComponent implements OnInit {
  entries?: QueueEntry[];
  songs?: Song[];
  success?: boolean;

  constructor(
    private songService: SongService,
    private logService: LogService,
  ) {
  }

  ngOnInit(): void {
    this.getSongQueue();
  }

  getHeaderRowDivClass() {
    return {
      'rowHeader': true
    }
  }

  getSongQueue(): void {
    const methodName = this.getSongQueue.name;

    this.songService
      .getSongQueue()
      .subscribe(
        (songQueue) => {
          this.entries = songQueue.list.sort(x => x.position)
          this.log(LogLevel.Success, 'Fetched song queue', methodName);
          this.log(LogLevel.Verbose, `songQueue: ${JSON.stringify(songQueue)}`, methodName);
          this.log(LogLevel.Verbose, `entries: ${JSON.stringify(this.entries)}`, methodName);
          this.log(LogLevel.Verbose, `entries.length: ${this.entries.length}`, methodName);
        }
      );
  }

  getSongList(): void {
    const methodName = this.getSongList.name;

    this.songService
      .getList()
      .subscribe((songList) => {
        this.songs = songList;
        this.log(LogLevel.Success, 'Fetched song list', methodName);
      });
  }

  setAsCurrent(queueEntry: QueueEntry): void {
    const methodName = this.setAsCurrent.name;
    const song = queueEntry.song;
    song.requestedBy = queueEntry.requests.name;
    this.log(LogLevel.Verbose, `Setting song as current: ${queueEntry.song.title}`, methodName);
    this.songService
      .setCurrentSong(song)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.log(LogLevel.Success, `Current song set to: ${queueEntry.song.title}`, methodName)
      });
  }

  markAsPlayed(entry: QueueEntry) {
    const methodName = this.markAsPlayed.name;
    this.songService
      .markAsPlayed(entry)
      .subscribe(
        () => {
          this.log(LogLevel.Success, 'Entry marked as played', methodName);
          this.getSongQueue();
        }
      );
  }

  removeFromQueue(entry: QueueEntry) {
    const methodName = this.removeFromQueue.name;
    this.songService
      .removeFromQueue(entry)
      .subscribe(
        () => {
          this.log(LogLevel.Success, 'Entry removed from queue', methodName);
          this.getSongQueue();
        }
      );
  }

  log(logLevel: LogLevel, message: string, methodName: string) {
    this.logService.log(logLevel, message, this.constructor.name, methodName)
  }
}