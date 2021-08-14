import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SongService } from '../song.service'
import { LogService, LogLevel } from '../log.service'
import { Song } from '../../json-schema/song'
import { StatusResponse } from '../../json-schema/statusResponse';
import { LocalStorageService } from 'app/local-storage.service';
import { Router } from '@angular/router';

enum Views {
  Lyrics, Chords, Tablature
}

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.css']
})
export class LyricsComponent implements OnInit {
  eViews = Views;

  public song: Song = new Song();
  private view: Views = Views.Lyrics;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private logService: LogService,
    private localStorageService: LocalStorageService,
    private router : Router
  ) {
  }

  ngOnInit(): void {
    this.getSongForPlay()
  }

  isEditMode(): boolean {
    return this.localStorageService.isEditMode();
  }

  getView(): Views {
    return this.view;
  }

  setView(view: Views): void {
    this.view = view;
  }

  getContentForView(): string {
    if (this.view == Views.Lyrics) {
      return this.song?.lyrics;
    } else if (this.view == Views.Chords) {
      return this.song?.chords;
    } else if (this.view == Views.Tablature) {
      return this.song?.tab;
    }

    return this.song?.lyrics;
  }

  getSongForPlay(): void {
    const methodName = this.getSongForPlay.name;
    const songId = +(this.route.snapshot.paramMap.get('id') || 0)

    if (songId) {
      this.songService.getSongById(songId)
        .subscribe(song => {
          const methodName = this.getSongForPlay.name;
          this.log(LogLevel.Verbose, `song: ${song}`, methodName);
          this.song = JSON.parse(song);
        });
    } else {
      this.log(LogLevel.Failure, "No id passed in", methodName)
    }
  }

  addToQueue(): void {
    const methodName = this.addToQueue.name;

    this.log(LogLevel.Verbose, `Adding song to queue: ${this.song.title}`, methodName);;
    this.songService
      .addToQueue(this.song)
      .subscribe((response: StatusResponse) => {
        this.log(LogLevel.Success, `Song added to queue: ${this.song.title}`, methodName);
      });

      this.router.navigate(["/song-queue"]);
  }

  setAsCurrent(): void {
    const methodName = this.setAsCurrent.name;

    this.log(LogLevel.Verbose, `Setting song as current: ${this.song.title}`, methodName);;
    this.songService
      .setCurrentSong(this.song)
      .subscribe((response: StatusResponse) => {
        this.log(LogLevel.Success, `Current song set to: ${this.song.title}`, methodName);
      });
  }

  markAsPlayed(): void {
    const methodName = this.markAsPlayed.name;
    this.logService.log(LogLevel.Verbose, "Marking non-queue song as played", this.constructor.name, methodName)
    this.songService
      .markNonQueueSongAsPlayed(this.song.ssId)
      .subscribe((response: StatusResponse) => {
        this.log(LogLevel.Success, `Marked non-queue song as played: ${this.song.title}`, methodName);
      });
      
      this.router.navigate(["/song-list"]);
  }

  log(logLevel: LogLevel, message: string, methodName: string): void {
    this.logService.log(logLevel, message, this.constructor.name)
  }
}