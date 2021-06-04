import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song';
import { SongService } from '../song.service';
import { StatusResponse } from '../../json-schema/statusResponse';
import { LogService, LogLevel } from '../log.service';
import { songComparator } from '../comparators'
import { LocalStorageService } from 'app/local-storage.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
})
export class SongListComponent implements OnInit {
  songs: Song[] = [];
  success?: boolean;
  fileName?: string;

  constructor(
    private songService: SongService,
    private logService: LogService,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    const methodName = this.ngOnInit.name;
    this.getSongList();
  }

  isEditMode(): boolean {
    return this.localStorageService.isEditMode();
  }

  getNextValidSongId(): number {
    const methodName = this.getNextValidSongId.name;

    let returnValue = 0

    if (this.songs) {
      for (let song of this.songs) {
        if (song.id > returnValue) {
          returnValue = song.id;
        }
      }
    }

    return returnValue;
  }

  getSongList(): void {
    const methodName = this.getSongList.name;
    this.log(LogLevel.Verbose, 'Getting song list', methodName);

    this.songService
      .getList()
      .subscribe((songList) => {
        this.songs = songList.sort(songComparator);
        this.log(LogLevel.Verbose, 'Fetched song list', methodName);
      });
  }

  setSongAsCurrent(songToSet: Song): void {
    const methodName = this.setSongAsCurrent.name;

    this.log(LogLevel.Verbose, `Setting song as current: ${songToSet.title}`, methodName);;
    this.songService
      .setCurrentSong(songToSet)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.log(LogLevel.Success, `Current song set to: ${songToSet.title}`, methodName);
      });
  }

  addSongToQueue(song: Song) {
    const methodName = this.addSongToQueue.name;

    this.log(LogLevel.Verbose, `id: ${song.id}`, methodName);

    this.log(LogLevel.Verbose, `song: ${JSON.stringify(song)}`, methodName);

    this.songService
      .addToQueue(song)
      .subscribe(
        () => {
          this.log(LogLevel.Success, 'Song added to queue', methodName);
        }
      );
  }

  promoteSong(song: Song) {
    this.setSongActiveStatus(song, true)
  }

  demoteSong(song: Song) {
    this.setSongActiveStatus(song, false)
  }

  setSongActiveStatus(song: Song, active: boolean) {
    const methodName = this.setSongActiveStatus.name;
    this.log(LogLevel.Verbose, `Setting current song active status to ${active}: ${song.title}`, methodName);    

    song.active = active;

    this.songService.saveSong(song)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.log(LogLevel.Success, `Set current song active status to ${song.active}: ${song.title}`, methodName);
        this.getSongList();
      });
  }

  log(logLevel: LogLevel, message: string, methodName: string) {
    this.logService.log(logLevel, message, this.constructor.name, methodName)
  }
}