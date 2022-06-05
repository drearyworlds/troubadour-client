import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song';
import { SongService } from '../song.service';
import { StatusResponse } from '../../json-schema/statusResponse';
import { LogService, LogLevel } from '../log.service';
import { LocalStorageService } from 'app/local-storage.service';

enum SortBy {
  ACTIVE = "active",
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
  sortBy: SortBy = SortBy.ARTIST;
  sortDirection: SortDirection = SortDirection.ASC;

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

  performSortByDefault() {
    const methodName = this.performSortByDefault.name;
    this.log(LogLevel.Verbose, `sorting by active/artist/year/title`, methodName)

    this.sortDirection = SortDirection.ASC;
    this.performSortByAll(new Array(SortBy.ACTIVE, SortBy.ARTIST, SortBy.YEAR, SortBy.TITLE));
  }

  performSortByAll(sortBy: Array<SortBy>) {
    const methodName = this.performSortByAll.name;

    for (let i = sortBy.length - 1; i >= 0; i--) {
      this.log(LogLevel.Verbose, `sorting by ${this.sortBy}, direction: ${this.sortDirection}`, methodName)
      this.performSort(sortBy[i], true)
    }

    //this.log(LogLevel.Info, `Sorted by ${sortBy}, direction: ${this.sortDirection}`, methodName)
  }

  performSort(sortBy: SortBy, preserveSortDirection : Boolean = false) {
    const methodName = this.performSort.name;

    // If we are already sorted by this column, just change sort direction (unless we are sorting by multiple fields)
    if (sortBy == this.sortBy && !preserveSortDirection) {
      this.sortDirection = (this.sortDirection == SortDirection.ASC) ? SortDirection.DESC : SortDirection.ASC;
      this.log(LogLevel.Info, `already sorted by ${this.sortBy}, changing direction to: ${this.sortDirection}`, methodName)
    }

    this.sortBy = sortBy
    this.log(LogLevel.Verbose, `sorting by ${this.sortBy}, direction: ${this.sortDirection}`, methodName)

    this.sort();
  }

  private getSortValueString(sortField: string, sortValue: string) {
    const methodName = this.getSortValueString.name;
    const THE_PREFIX = "The ";

    try {
      if (sortField == undefined) {
        this.log(LogLevel.Verbose, `sortField was undefined`, methodName);
      }
      if (sortValue == undefined) {
        this.log(LogLevel.Verbose, `sortValue was undefined`, methodName);
      }

      if (sortField.startsWith("date")) {
        sortValue = this.formatDate(new Date(sortValue));
      } else if (sortField == SortBy.ACTIVE) {
        sortValue = (sortValue ? "0" : "1");
      } else if ((sortField == SortBy.ARTIST || sortField == SortBy.TITLE) && sortValue.startsWith(THE_PREFIX)) {
        sortValue = sortValue.substring(THE_PREFIX.length);
      }
    } catch (ex) {
      this.log(LogLevel.Failure, `exception: ${ex} with value ${sortValue}`, methodName);
      this.log(LogLevel.Failure, `sortField: ${sortField}`, methodName);
      this.log(LogLevel.Failure, `sortValue: ${sortValue}`, methodName);
    }

    return sortValue;
  }

  private sort() {
    const methodName = this.sort.name;
    let sortField = this.sortBy as keyof Song

    this.log(LogLevel.Verbose, `Sorting by ${sortField}`, methodName);

    this.songs.sort((s1, s2,) => {
      let s1ValueToSort = this.getSortValueString(sortField, s1[sortField] as string);
      let s2ValueToSort = this.getSortValueString(sortField, s2[sortField] as string);

      if (s1ValueToSort < s2ValueToSort) {
        //this.log(LogLevel.Verbose, s1ValueToSort + " is less than " + s2ValueToSort, methodName);
        return (this.sortDirection == SortDirection.ASC) ? -1 : 1;
      } else if (s1ValueToSort > s2ValueToSort) {
        //this.log(LogLevel.Verbose, s1ValueToSort + " is greater than " + s2ValueToSort, methodName);
        return (this.sortDirection == SortDirection.ASC) ? 1 : -1;
      } else {
        //this.log(LogLevel.Verbose, s1ValueToSort + " is equal to " + s2ValueToSort, methodName);
        return 0;
      }
    });
  }

  songIsNew(song: Song): boolean {
    const methodName = this.songIsNew.name;
    // if (song.isNew) {
    //   return song.isNew;
    // }

    var fourWeeksInMs = 24192e5;
    var dateFourWeeksAgo = new Date(Date.now() - fourWeeksInMs);
    song.isNew = new Date(song.dateAdded) >= dateFourWeeksAgo;
    //this.log(LogLevel.Verbose, `song ${song.title} isNew: ${song.isNew}`, methodName)
    return (song.isNew);
  }

  formatDate(dateToFormat: Date): string {
    function pad(numberToPad: number) {
      if (numberToPad < 10) {
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
        this.performSortByDefault();
        this.log(LogLevel.Verbose, 'Fetched song list', methodName);
        this.localStorageService.setSongList(this.songs);
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