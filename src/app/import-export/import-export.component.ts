import { Component, OnInit } from '@angular/core';
import { Song } from '../../json-schema/song';
import { StatusResponse } from '../../json-schema/statusResponse';
import { SongService } from '../song.service';
import { MessageService } from '../message.service';

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
    private messageService: MessageService
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
          for (const song of songList.songs) {
            song.composer = `${song.artist}`
            song.comment = `${song.album} (${song.year})`
          }

          var sJson = JSON.stringify(songList);
          var element = document.createElement('a');
          element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
          element.setAttribute('download', "songList.json");
          element.style.display = 'none';
          document.body.appendChild(element);
          // simulate click
          element.click();
          document.body.removeChild(element);
        }
      );
  }

  private logFailure(message: string) {
    this.messageService.logFailure(message, this.constructor.name);
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
