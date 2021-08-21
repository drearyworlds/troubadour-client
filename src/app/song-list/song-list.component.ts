import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song';
import { SongService } from '../song.service';
import { StatusResponse } from '../../json-schema/statusResponse';
import { LogService, LogLevel } from '../log.service';
import { LocalStorageService } from 'app/local-storage.service';

enum SortBy {
  ARTIST = "artist",
  ALBUM = "album",
  YEAR = "year",
  TITLE = "title",
  DATE_ADDED = "dateAdded",
  DATE_PLAYED = "datePlayed",
  PLAY_COUNT = "playCount",
};

enum SortDirection {
  ASC = "ASC",
  DESC = "DESC"
};

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
})

export class SongListComponent implements OnInit {
  // Make a variable reference to our Enum
  eSortBy = SortBy;
  eSortDirection = SortDirection;

  songs: Song[] = [];
  sortedBy: SortBy = SortBy.ARTIST;
  sortedDirection: SortDirection = SortDirection.ASC;

  constructor(
    private songService: SongService,
    private logService: LogService,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    const methodName = this.ngOnInit.name;
    this.getSongList();
  }

  isEditMode(): boolean {
    return this.localStorageService.isEditMode();
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

  sortByArtistYearAlbumTitle() {
    const methodName = this.sortByArtistYearAlbumTitle.name;
    this.log(LogLevel.Info, `sorting by artist/year/album/title`, methodName)

    this.sortedDirection = SortDirection.ASC;
    this.sortBy(SortBy.TITLE)
    this.sortBy(SortBy.ALBUM)
    this.sortBy(SortBy.YEAR)
    this.sortBy(SortBy.ARTIST)
  }

  sortBy(sortBy: SortBy) {
    const methodName = this.sortBy.name;

    // If we are already sorted by this column, just change sort direction
    if (sortBy == this.sortedBy) {
      this.sortedDirection = (this.sortedDirection == SortDirection.ASC) ? SortDirection.DESC : SortDirection.ASC;
      this.log(LogLevel.Info, `already sorted by ${this.sortedBy}, changing direction to: ${this.sortedDirection}`, methodName)
    }

    this.sortedBy = sortBy
    this.log(LogLevel.Info, `sorting by ${this.sortedBy}, direction: ${this.sortedDirection}`, methodName)

    this.sort();
  }

  private getSortValueString(sortField: string, sortValue: string) {
    const THE_PREFIX = "The ";

    try {
      if (sortField == undefined) {
        console.log(`sortField was undefined`)
      }
      if (sortValue == undefined) {
        console.log(`sortValue was undefined`)
      }

      if (sortField.startsWith("date")) {
        //console.log(`sortField "${sortField}" starts with "date"`)
        sortValue = this.formatDate(new Date(sortValue));
      }

      if (sortField == "active") {
        //console.log(`sortField "${sortField}" is "active"`)
        sortValue = (sortValue ? "0" : "1");
      }

      if ((sortField == "artist" || sortField == "title") && sortValue.startsWith(THE_PREFIX)) {
        //console.log(`sortValue "${sortValue}" starts with "${THE_PREFIX}"`)
        sortValue = sortValue.substr(THE_PREFIX.length);
      }
    } catch (ex) {
      console.log(`exception: ${ex} with value ${sortValue}`);
      console.log(`sortField: ${sortField}`);
      console.log(`sortValue: ${sortValue}`);
    }

    return sortValue;
  }

  private sort() {
    let sortField = this.sortedBy as keyof Song

    console.log(`Sorting by ${sortField}`)

    this.songs.sort((s1, s2,) => {
      let s1ValueToSort = this.getSortValueString(sortField, s1[sortField] as string);
      let s2ValueToSort = this.getSortValueString(sortField, s2[sortField] as string);

      return (s1.active != s2.active) ? (s1.active ? -1 : 1) :
        (this.sortedDirection == SortDirection.ASC) ?
          (s1ValueToSort <= s2ValueToSort ? -1 : 1)
          : (s1ValueToSort >= s2ValueToSort ? -1 : 1)
    });
  }

  isNew(song: Song): boolean {
    const methodName = this.isNew.name;
    if (song.isNew) {
      return song.isNew;
    }

    var fourWeeksInMs = 24192e5;
    var dateFourWeeksAgo = new Date(Date.now() - fourWeeksInMs);
    song.isNew = new Date(song.dateAdded) >= dateFourWeeksAgo;
    this.log(LogLevel.Verbose, `song ${song.title} isNew: ${song.isNew}`, methodName)
    return (song.isNew);
  }

  formatDate(dateToFormat: Date): string {
    function pad(numberToPad: number) {
      if (numberToPad < 9) {
        return "0" + numberToPad;
      } else {
        return `${numberToPad}`;
      }
    }

    dateToFormat = new Date(dateToFormat);
    return `${dateToFormat.getFullYear()}.${pad(dateToFormat.getMonth() + 1)}.${pad(dateToFormat.getDate())}`;
  }

  getSongList(): void {
    const methodName = this.getSongList.name;
    this.log(LogLevel.Verbose, 'Getting song list', methodName);

    this.songService
      .getList()
      .subscribe((songList) => {
        this.songs = songList;
        this.sortByArtistYearAlbumTitle();
        this.log(LogLevel.Verbose, 'Fetched song list', methodName);
      });
  }

  setSongAsCurrent(songToSet: Song): void {
    const methodName = this.setSongAsCurrent.name;

    this.log(LogLevel.Verbose, `Setting song as current: ${songToSet.title}`, methodName);;
    this.songService
      .setCurrentSong(songToSet)
      .subscribe((response: StatusResponse) => {
        this.log(LogLevel.Success, `Current song set to: ${songToSet.title}`, methodName);
      });
  }

  addSongToQueue(song: Song) {
    const methodName = this.addSongToQueue.name;

    this.log(LogLevel.Verbose, `id: ${song.id}`, methodName);

    this.log(LogLevel.Verbose, `song: ${JSON.stringify(song)}`, methodName);

    this.songService
      .addToQueue(song)
      .subscribe(
        () => {
          this.log(LogLevel.Success, 'Song added to queue', methodName);
        }
      );
  }

  promoteSong(song: Song) {
    this.setSongActiveStatus(song, true)
  }

  demoteSong(song: Song) {
    this.setSongActiveStatus(song, false)
  }

  setSongActiveStatus(song: Song, active: boolean) {
    const methodName = this.setSongActiveStatus.name;
    this.log(LogLevel.Verbose, `Setting current song active status to ${active}: ${song.title}`, methodName);

    song.active = active;

    this.songService.saveSong(song)
      .subscribe((response: StatusResponse) => {
        this.log(LogLevel.Success, `Set current song active status to ${song.active}: ${song.title}`, methodName);
        this.getSongList();
      });
  }

  log(logLevel: LogLevel, message: string, methodName: string) {
    this.logService.log(logLevel, message, this.constructor.name, methodName)
  }
}