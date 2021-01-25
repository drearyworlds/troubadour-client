import { Component, OnInit } from '@angular/core';
import { Song } from '../song'
import { SongService } from '../song.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})

export class SongListComponent implements OnInit {
  songs? : Song[]
  hideall : boolean = true

  constructor(
    private songService: SongService,
    private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getSongList();
  }

  getSongList(): void {
    this.songService.getSongList()
      .subscribe(songs => this.songs = songs);
  }
}