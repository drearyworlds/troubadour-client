import { Injectable } from '@angular/core';
import { Song } from '../json-schema/song';
import { LogService, LogLevel } from './log.service';
import { SsSong } from '../json-schema/ss-objects'

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(private logService: LogService) { }

  getSsSongFromSong(ssSongs: SsSong[], song: Song): SsSong {
    const methodName = this.getSsSongFromSong.name;

    let returnSsSong: SsSong = new SsSong();

    if (ssSongs) {
      this.log(LogLevel.Verbose, `this.ssSongs is valid`, methodName);;

      if (ssSongs.length > 0) {
        for (let ssSong of ssSongs) {
          if (song.artist == ssSong.artist) {
            if (song.title == ssSong.title) {
              this.log(LogLevel.Verbose, `Matched ssSong: ${ssSong.title}`, methodName);;
              returnSsSong = ssSong;
              break;
            }
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
    }

    return returnSsSong;
  }

  log(logLevel: LogLevel, message: string, methodName: string) {
    this.logService.log(logLevel, message, this.constructor.name, methodName)
  }
}
