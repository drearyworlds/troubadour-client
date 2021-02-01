import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SongService } from '../song.service'
import { MessageService } from '../message.service'

@Component({
  selector: 'app-chords-lyrics',
  templateUrl: './chords-lyrics.component.html',
  styleUrls: ['./chords-lyrics.component.css']
})
export class ChordsLyricsComponent implements OnInit {
  public chordsLyrics? : string;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getChordsLyrics()
  }

  getChordsLyrics(): void {
    const artist = this.route.snapshot.paramMap.get('artist') || "";
    const title = this.route.snapshot.paramMap.get('title') || "";
    this.songService.getChordsLyrics(artist, title)
      .subscribe(chordsLyrics => this.chordsLyrics = chordsLyrics);

      this.log(this.chordsLyrics || 'chordsLyrics: null')
  }

    /** Log a ChordsLyricsComponent message with the MessageService */
    private log(message: string) {
      this.messageService.add(`ChordsLyricsComponent: ${message}`);
    }
}