import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song';
import { SongService } from '../song.service';
import { SsService } from '../ss.service';
import { StatusResponse } from '../../json-schema/statusResponse';
import { LogService, LogLevel } from '../log.service';
import { SsSong } from '../../json-schema/ss-objects'
import { songComparator } from '../comparators'
import { ConfigurationService } from 'app/configuration.service';

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
    private logService: LogService,
    private ssService: SsService,
    private configurationService: ConfigurationService
  ) {
  }

  ngOnInit(): void {
    const methodName = this.ngOnInit.name;
    this.getSongList();
    this.getSsSongList();
  }

  isEditMode() : boolean{
    return this.configurationService.isEditMode();
  }

  getRowDivClass(active: boolean) {
    const methodName = this.getRowDivClass.name;

    return {
      'table-danger': !active
    }

  }

  getCellDivClass(active: boolean) {
    const methodName = this.getCellDivClass.name;

    return {
      'table-danger': !active
    }
  }

  getSsSongFromSong(song: Song): SsSong | null {
    const methodName = this.getSsSongFromSong.name;

    let returnSsSong: SsSong | null = new SsSong();

    if (this.ssSongs) {
      this.log(LogLevel.Verbose, `this.ssSongs is valid`, methodName);;

      if (this.ssSongs.length > 0) {
        for (let ssSong of this.ssSongs) {
          if (song.artist == ssSong.artist) {
            if (song.title == ssSong.title) {
              this.log(LogLevel.Verbose, `Matched ssSong: ${ssSong.title}`, methodName);;
              returnSsSong = ssSong;
              break;
            } else {
              this.log(LogLevel.Verbose, `${ssSong.title} != ${song.title}`, methodName);
            }
          } else {
            this.log(LogLevel.Verbose, `${ssSong.artist} != ${song.artist}`, methodName);
          }
        }

        if (returnSsSong.id == 0) {
          this.log(LogLevel.Warning, `Did not find matching ssSong for: ${song.artist} - ${song.title}`, methodName);
        }
      } else {
        this.log(LogLevel.Failure, "ssSongs has no entries", methodName);
      }
    } else {
      this.log(LogLevel.Failure, "this.ssSongs is null", methodName);
      returnSsSong = null
    }

    return returnSsSong;
  }

  getNextValidSongId(): number {
    const methodName = this.getNextValidSongId.name;

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
    const methodName = this.getSongList.name;

    this.songService
      .getList()
      .subscribe((songList) => {
        this.songs = songList.songs.sort(songComparator);
        this.log(LogLevel.Verbose, 'Fetched song list', methodName);
      });
  }

  getSsSongList(): void {
    const methodName = this.getSsSongList.name;

    this.ssService
      .getSongList()
      .subscribe((ssSongList) => {
        this.log(LogLevel.Verbose, `Got ssSongList: ${ssSongList}`, methodName)

        if (ssSongList == null) {
          this.log(LogLevel.Failure, `ssSongList is null!`, methodName)
        } else if (ssSongList.items == null) {
          this.log(LogLevel.Failure, `ssSongList.items is null!`, methodName)
        } else {
          this.ssSongs = ssSongList.items;
          this.log(LogLevel.Verbose, 'Fetched SS song list', methodName);
        }
      });
  }

  setAsCurrent(songToSet: Song): void {
    const methodName = this.setAsCurrent.name;

    this.log(LogLevel.Verbose, `Setting song as current: ${songToSet.title}`, methodName);;
    this.songService
      .setCurrentSong(songToSet)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.log(LogLevel.Success, `Current song set to: ${songToSet.title}`, methodName);
      });
  }

  addToQueue(song: Song) {
    const methodName = this.addToQueue.name;

    this.log(LogLevel.Verbose, `id: ${song.id}`, methodName);
    let ssSong: SsSong | null = this.getSsSongFromSong(song);

    this.log(LogLevel.Verbose, `ssSong: ${JSON.stringify(ssSong)}`, methodName);

    if (ssSong) {
      this.ssService
        .addToQueue(ssSong.id)
        .subscribe(
          () => {
            this.log(LogLevel.Success, 'Entry added to queue', methodName);
          }
        );
    } else {
      this.log(LogLevel.Failure, 'ssSong is null', methodName);
    }
  }

  promote(song: Song) {
    const methodName = this.promote.name;

    song.active = true;
    this.toggleSongActiveStatus(song)
  }

  demote(song: Song) {
    const methodName = this.demote.name;

    song.active = false;
    this.toggleSongActiveStatus(song)
  }

  toggleSongActiveStatus(song: Song) {
    const methodName = this.toggleSongActiveStatus.name;

    this.songService.saveSongData(song)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.log(LogLevel.Success, `Toggled current song active status to ${song.active}: ${song.title}`, methodName);
        this.getSongList();
      });

    let ssSong: SsSong | null = this.getSsSongFromSong(song)

    if (ssSong) {
      if (ssSong.id != 0) {
        this.log(LogLevel.Verbose, `Updating existing song`, methodName);
        ssSong.active = song.active;

        this.ssService.updateSong(ssSong)
          .subscribe((songResponse: SsSong) => {
            this.success = (songResponse.id != 0)
            this.log(LogLevel.Success, `Toggled current ssSong active status to ${songResponse.active} for ${songResponse.title}`, methodName);
            this.getSsSongList();
          });
      } else {
        this.log(LogLevel.Verbose, `SsSong not found. Adding to SS`, methodName);
        // Create ssSong from song
        ssSong = new SsSong(song)

        this.ssService.addSong(ssSong)
          .subscribe((songResponse: SsSong) => {
            this.success = (songResponse.id != 0)
            this.log(LogLevel.Success, `Added ssSong ${songResponse.active} for ${songResponse.title}`, methodName);
            this.getSsSongList();
          });
      }
    } else {
      this.log(LogLevel.Failure, "Failed to promote song", methodName)
    }
  }

  log(logLevel: LogLevel, message: string, methodName: string) {
    this.logService.log(logLevel, message, this.constructor.name, methodName)
  }
}
