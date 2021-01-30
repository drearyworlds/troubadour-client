import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song'
import { StatusResponse } from '../../json-schema/statusResponse'
import { SongService } from '../song.service';
import { MessageService } from '../message.service';
import { isSuccess } from 'angular-in-memory-web-api';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})

export class SongListComponent implements OnInit {
  songs?: Song[]
  success?: boolean
  hideall: boolean = true
  currentSong?: Song;

  constructor(
    private songService: SongService,
    private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getSongList();
  }

  getSongList(): void {
    this.songService.getSongList()
      .subscribe(songList => this.songs = songList.songs);
  }

  songClicked(clickedSong: Song): void {
    console.log("I clicked a song");
    this.messageService.add(`Clicked a song: ${clickedSong.title}`)
    this.songService.setCurrentSong(clickedSong)
      .subscribe(response => this.success = response.success)

    this.messageService.add(`Success: ${this.success}`)
  }
}