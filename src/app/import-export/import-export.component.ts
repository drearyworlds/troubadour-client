import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song';
import { Drink } from '../../json-schema/drink';
import { StatusResponse } from '../../json-schema/statusResponse';
import { SongService } from '../song.service';
import { DrinkService } from '../drink.service';
import { LogService } from '../log.service';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.css'],
})
export class ImportExportComponent implements OnInit {
  songs?: Song[];
  success?: boolean;

  constructor(
    private songService: SongService,
    private drinkService: DrinkService,
    private logService: LogService
  ) { }

  ngOnInit(): void {
  }

  async importSongList(event: any) {
    const fileToImport: File = event.target.files[0];

    if (fileToImport) {
      (await this.songService.importSongList(fileToImport))
        .subscribe((response: StatusResponse) => {
          this.success = response.success
          this.logSuccess("Song list imported")
        });
    }
  }

  exportSongList() {
    this.songService
      .getList()
      .subscribe(
        (songList) => {
          var songListJson = JSON.stringify(songList);
          var element = document.createElement('a');
          element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(songListJson));
          element.setAttribute('download', "songList.json");
          element.style.display = 'none';
          document.body.appendChild(element);
          // simulate click
          element.click();
          document.body.removeChild(element);
        }
      );
  }

  async importDrinkList(event: any) {
    const fileToImport: File = event.target.files[0];

    if (fileToImport) {
      (await this.drinkService.importDrinkList(fileToImport))
        .subscribe((response: StatusResponse) => {
          this.success = response.success
          this.logSuccess("Drink list imported")
        });
    }
  }

  exportDrinkList() {
    this.drinkService
      .getList()
      .subscribe(
        (drinkList) => {
          var drinkListJson = JSON.stringify(drinkList);
          var element = document.createElement('a');
          element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(drinkListJson));
          element.setAttribute('download', "drinkList.json");
          element.style.display = 'none';
          document.body.appendChild(element);
          // simulate click
          element.click();
          document.body.removeChild(element);
        }
      );
  }

  private logFailure(message: string) {
    this.logService.logFailure(message, this.constructor.name);
  }

  private logSuccess(message: string) {
    this.logService.logSuccess(message, this.constructor.name);
  }

  private logInfo(message: string) {
    this.logService.logInfo(message, this.constructor.name);
  }

  private logVerbose(message: string) {
    this.logService.logVerbose(message, this.constructor.name);
  }
}
