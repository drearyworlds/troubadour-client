import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song';
import { SongService } from '../song.service';
import { SsService } from '../ss.service';
import { StatusResponse } from '../../json-schema/statusResponse';
import { MessageService } from '../message.service';
import { SsSong } from '../../json-schema/ss-objects'
import { songComparator } from '../comparators'

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
})
export class SongListComponent implements OnInit {
  songs?: Song[];
  ssSongs?: SsSong[];
  success?: boolean;
  fileName?: string;

  constructor(
    private songService: SongService,
    private messageService: MessageService,
    private ssService: SsService
  ) { }

  ngOnInit(): void {
    this.getSongList();
    this.getSsSongList();
  }

  getRowDivClass(active: boolean) {
    return {
      'table-danger': !active
    }

  }

  getCellDivClass(active: boolean) {
    return {
      'table-danger': !active
    }
  }

  getSsSongFromSong(song: Song): SsSong {
    let returnSsSong: SsSong = new SsSong();

    if (this.ssSongs) {
      this.logVerbose(`GetSsSongFromSong`);

      if (this.ssSongs.length > 0) {
        for (let ssSong of this.ssSongs) {
          if (song.artist == ssSong.artist) {
            if (song.title == ssSong.title) {
              this.logVerbose(`Matched ssSong: ${ssSong.title}`);
              returnSsSong = ssSong;
              break;
            } else {
              this.logVerbose(`${ssSong.title} != ${song.title}`)
            }
          } else {
            this.logVerbose(`${ssSong.artist} != ${song.artist}`)
          }
        }

        if (returnSsSong.id == 0) {
          this.logWarning(`Did not find matching ssSong for: ${song.artist} - ${song.title}`)
        }
      } else {
        this.logFailure("ssSongs has no entries")
      }
    } else {
      this.logVerbose("this.ssSongs is null")
    }

    return returnSsSong;
  }

  getNextValidSongId(): number {
    let returnValue = 0

    if (this.songs) {
      for (let song of this.songs) {
        if (song.id > returnValue) {
          returnValue = song.id;
        }
      }
    }

    return returnValue;
  }

  getSongList(): void {
    this.songService
      .getList()
      .subscribe((songList) => {
        this.songs = songList.songs.sort(songComparator);
        this.logVerbose('Fetched song list');
      });
  }

  getSsSongList(): void {
    this.ssService
      .getSongList()
      .subscribe((ssSongList) => {
        this.ssSongs = ssSongList.items;
        this.logVerbose('Fetched SS song list');
      });
  }

  setAsCurrent(songToSet: Song): void {
    this.logVerbose(`Setting song as current: ${songToSet.title}`);
    this.songService
      .setCurrentSong(songToSet)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.logSuccess(`Current song set to: ${songToSet.title}`)
      });
  }

  addToQueue(song: Song) {
    this.logVerbose('addToQueue');
    let ssSong: SsSong = this.getSsSongFromSong(song);

    this.logVerbose(`ssSong: ${JSON.stringify(ssSong)}`)

    this.ssService
      .addToQueue(ssSong.id)
      .subscribe(
        () => {
          this.logSuccess('Entry added to queue');
        }
      );

    this.logVerbose('addToQueue');
  }

  promote(song: Song) {
    song.active = true;
    this.toggleSongActiveStatus(song)
  }

  demote(song: Song) {
    song.active = false;
    this.toggleSongActiveStatus(song)
  }

  toggleSongActiveStatus(song: Song) {
    this.songService.saveSongData(song)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.logSuccess(`Toggled current song active status to ${song.active}: ${song.title}`)
        this.getSongList();
      });

    let ssSong: SsSong = this.getSsSongFromSong(song)

    if (ssSong && ssSong.id != 0) {
      this.logVerbose(`Updating existing song`)
      ssSong.active = song.active;

      this.ssService.updateSong(ssSong)
        .subscribe((songResponse: SsSong) => {
          this.success = (songResponse.id != 0)
          this.logSuccess(`Toggled current song active status to ${songResponse.active} for ${songResponse.title}`)
          this.getSsSongList();
        });
    } else {
      this.logVerbose(`Adding song to SS`)
      // Create ssSong from song
      ssSong = new SsSong(song)

      this.ssService.addSong(ssSong)
        .subscribe((songResponse: SsSong) => {
          this.success = (songResponse.id != 0)
          this.logSuccess(`Toggled current song active status to ${songResponse.active} for ${songResponse.title}`)
          this.getSsSongList();
        });
      }
  }

  private logFailure(message: string) {
    this.messageService.logFailure(message, this.constructor.name);
  }

  private logWarning(message: string) {
    this.messageService.logWarning(message, this.constructor.name);
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
