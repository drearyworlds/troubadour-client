import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SongService } from '../song.service'
import { LogService, LogLevel } from '../log.service'
import { Song } from '../../json-schema/song'
import { LocalStorageService } from 'app/local-storage.service';
import { SongListComponent } from '../song-list/song-list.component'

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
    this.getSongData()
  }

  isEditMode(): boolean {
    return this.localStorageService.isEditMode();
  }

  getSongData(): void {
    const songId = +(this.route.snapshot.paramMap.get('id') || 0)

    if (songId) {
      this.songService.getDataBySongId(songId)
        .subscribe(song => {
          this.song = JSON.parse(song);
          this.log(LogLevel.Verbose, JSON.stringify(this.song))
        });
    } else {
      this.log(LogLevel.Failure, "No id passed in. Trying artist and title instead")

      const artist = this.route.snapshot.paramMap.get('artist')
      const title = this.route.snapshot.paramMap.get('title')

      if (artist && title) {
        this.songService.getDataByArtistTitle(artist, title)
          .subscribe(songString => {
            this.song = JSON.parse(songString);
            this.log(LogLevel.Verbose, `Retreived lyrics for ${this.song?.artist} - ${this.song?.title}`)
            this.log(LogLevel.Verbose, JSON.stringify(this.song))
          });
      } else {
        this.log(LogLevel.Failure, "No artist and title passed in")
      }
    }
  }

  // addToQueue() {
  //   this.songListComponent.addToQueue(this.song);
  // }

  // setAsCurrent() {
  //   this.songListComponent.setAsCurrent(this.song);
  // }

  log(logLevel: LogLevel, message: string) {
    this.logService.log(logLevel, message, this.constructor.name)
  }
}