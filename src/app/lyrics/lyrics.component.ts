import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SongService } from '../song.service'
import { LogService, LogLevel } from '../log.service'
import { Song } from '../../json-schema/song'
import { LocalStorageService } from 'app/local-storage.service';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.css']
})
export class LyricsComponent implements OnInit {
  public song: Song = new Song();

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private logService: LogService,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.getSongForPlay()
  }

  isEditMode(): boolean {
    return this.localStorageService.isEditMode();
  }

  getSongForPlay(): void {
    const methodName = this.getSongForPlay.name;
    const songId = +(this.route.snapshot.paramMap.get('id') || 0)

    if (songId) {
      this.songService.getSongById(songId)
        .subscribe(song => {
          this.log(LogLevel.Verbose, `song: ${song}`, methodName);
          this.song = JSON.parse(song);
          this.log(LogLevel.Verbose, JSON.stringify(this.song), methodName)
        });
    } else {
      this.log(LogLevel.Failure, "No id passed in", methodName)
    }
  }

  addToQueue() {
    const methodName = this.addToQueue.name;
    this.songService.addToQueue(this.song)
  }

  setAsCurrent() {
    const methodName = this.setAsCurrent.name;
    this.logService.log(LogLevel.Verbose, "Setting as current", this.constructor.name, methodName)
    this.songService.setCurrentSong(this.song)
  }

  markAsPlayed() {
    const methodName = this.markAsPlayed.name;
    this.logService.log(LogLevel.Verbose, "Marking as played", this.constructor.name, methodName)
    this.songService.markNonQueueSongAsPlayed(this.song.id)
  }

  log(logLevel: LogLevel, message: string, methodName: string) {
    this.logService.log(logLevel, message, this.constructor.name)
  }
}