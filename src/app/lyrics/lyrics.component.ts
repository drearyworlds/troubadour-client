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
  public lyrics: string = "";

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getDataAndLyrics()
  }

  getDataAndLyrics(): void {
    const artist = this.route.snapshot.paramMap.get('artist') || "";
    const title = this.route.snapshot.paramMap.get('title') || "";

    this.songService.getData(artist, title)
      .subscribe(song => {
        this.song = JSON.parse(song);
        this.log(JSON.stringify(this.song))
      });

    this.songService.getLyrics(artist, title)
      .subscribe(lyrics => {
        this.lyrics = lyrics;
        this.log(this.lyrics.substring(0, 14) || 'lyrics: null')
      });
  }

  /** Log a LyricsComponent message with the MessageService */
  private log(message: string) {
    this.messageService.add(`LyricsComponent: ${message}`);
  }
}