import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SongService } from '../song.service'
import { LogService, LogLevel } from '../log.service'
import { Song } from '../../json-schema/song'
import { StatusResponse } from '../../json-schema/statusResponse'

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.css']
})
export class EditSongComponent implements OnInit {
  public song?: Song;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private logService: LogService
  ) {
  }

  ngOnInit(): void {
    this.getSongDataForEdit()
  }

  getSongDataForEdit(): void {
    const songId = +(this.route.snapshot.paramMap.get('id') || 0)

    this.songService.getDataBySongId(songId)
      .subscribe(songJsonString => {
        if (songJsonString) {
          this.song = JSON.parse(songJsonString);
          this.log(LogLevel.Success, `Retrieved song data for: ${this.song?.title}`)
        }

        if (!this.song) {
          this.log(LogLevel.Info, `Did not find song. Adding new song.`)
          this.song = new Song();
          this.song.id = songId;
        }
      });
  }

  saveSongData() {
    if (this.song) {
      this.songService.saveSongData(this.song)
        .subscribe((response: StatusResponse) => {
          this.log(LogLevel.Success, `Saved song data for: ${this.song?.title}`)
          this.log(LogLevel.Verbose, `response: ${JSON.stringify(response)}`)
        });
    }
  }

  log(logLevel: LogLevel, message: string) {
    this.logService.log(logLevel, message, this.constructor.name)
  }
}