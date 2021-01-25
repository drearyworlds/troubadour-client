import { Injectable } from '@angular/core';
import { Song } from './song';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class SongService {
  // URL to web api
  private songsUrl = 'api/songs';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.songsUrl)
  }

  /** Log a SongService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`SongService: ${message}`);
  }
}