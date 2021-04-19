import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SongService } from '../song.service'
import { LogService } from '../log.service'
import { Song } from '../../json-schema/song'

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.css']
})
export class LyricsComponent implements OnInit {
  public song?: Song;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private logService: LogService
  ) { }

  ngOnInit(): void {
    this.getSongData()
  }

  getSongData(): void {
    const songId = +(this.route.snapshot.paramMap.get('id') || 0)

    if (songId) {
      this.songService.getDataBySongId(songId)
        .subscribe(song => {
          this.song = JSON.parse(song);
          this.logVerbose(JSON.stringify(this.song))
        });
    } else {
      this.logFailure("No id passed in. Trying artist and title instead")

      const artist = this.route.snapshot.paramMap.get('artist')
      const title = this.route.snapshot.paramMap.get('title')

      if (artist && title) {
        this.songService.getDataByArtistTitle(artist, title)
          .subscribe(songString => {
            this.song = JSON.parse(songString);
            this.logVerbose(`Retreived lyrics for ${this.song?.artist} - ${this.song?.title}`)
            this.logVerbose(JSON.stringify(this.song))
          });
      } else {
        this.logFailure("No artist and title passed in")
      }
    }
  }

  private logFailure(message: string) {
    this.logService.logFailure(message, this.constructor.name);
  }
  
  private logSuccess(message: string) {
    this.logService.logSuccess(message, this.constructor.name);
  }

  private logInfo(message: string) {
    this.logService.logInfo(message, this.constructor.name);
  }

  private logVerbose(message: string) {
    this.logService.logVerbose(message, this.constructor.name);
  }
}