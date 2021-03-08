import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SongService } from '../song.service'
import { MessageService } from '../message.service'
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
    private messageService: MessageService
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
          this.log(JSON.stringify(this.song))
        });
    } else {
      this.log("No id passed in. Trying artist and title instead")

      const artist = this.route.snapshot.paramMap.get('artist')
      const title = this.route.snapshot.paramMap.get('title')

      if (artist && title) {
        this.songService.getDataByArtistTitle(artist, title)
          .subscribe(song => {
            this.song = JSON.parse(song);
            this.log(JSON.stringify(this.song))
          });
      } else {
        this.log("No artist and title passed in")
      }
    }
  }

  /** Log a LyricsComponent message with the MessageService */
  private log(message: string) {
    this.messageService.add(`LyricsComponent: ${message}`);
  }
}