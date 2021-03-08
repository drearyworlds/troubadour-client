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
      .subscribe(song => {
        this.log(`song: ${song}`)
        this.song = JSON.parse(song);
        this.log(JSON.stringify(this.song))
      });
  }

  saveSongData() {
    if (this.song) {
      this.songService.saveSongData(this.song)
        .subscribe((response: StatusResponse) => {
          this.log(`Saved songID: ${this.song?.id}`)
          this.log(`response: ${response}`)
        });
    }
  }

  /** Log a EditSongComponent message with the MessageService */
  private log(message: string) {
    this.messageService.add(`EditSongComponent: ${message}`);
  }
}