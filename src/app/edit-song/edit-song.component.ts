import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SongService } from '../song.service'
import { MessageService } from '../message.service'
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
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getSongDataForEdit()
  }

  getSongDataForEdit(): void {
    const songId = +(this.route.snapshot.paramMap.get('id') || 0)

    this.songService.getDataBySongId(songId)
      .subscribe(songJsonString => {
        if (songJsonString) {
          this.song = JSON.parse(songJsonString);
          this.logSuccess(`Retrieved song data for: ${this.song?.title}`)
        }

        if (!this.song) {
          this.logInfo(`Did not find song. Adding new song.`)
          this.song = new Song();
          this.song.id = songId;
        }
      });
  }

  saveSongData() {
    if (this.song) {
      this.songService.saveSongData(this.song)
        .subscribe((response: StatusResponse) => {
          this.logSuccess(`Saved song data for: ${this.song?.title}`)
          this.logVerbose(`response: ${JSON.stringify(response)}`)
        });
    }
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