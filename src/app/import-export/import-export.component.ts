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
          this.log(`Success: ${this.success}`)
          alert("done!")
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
          element.click(); // simulate click
          document.body.removeChild(element);
        }
      );
  }

  private log(message: string) {
    this.messageService.add(`ImportExportComponent: ${message}`);
  }
}
