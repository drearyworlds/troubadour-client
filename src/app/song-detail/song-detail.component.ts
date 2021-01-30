import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Song } from '../../json-schema/song';
import { SongService } from '../song.service';
import { getSafePropertyAccessString } from '@angular/compiler';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.css']
})
export class SongDetailComponent implements OnInit {
  @Input() song?: Song;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getSong();
  }

  getSong(): void {
    // var id = this.route.snapshot.paramMap.get('id')
    // if (id) {
    //   const songId = +id

    //   this.songService.getSong(songId)
    //     .subscribe(song => this.song = song);
    //   }
  }

  goBack(): void {
    this.location.back();
  }
}
