import { Injectable } from '@angular/core';
import { Song } from '../json-schema/song';
import { StatusResponse } from '../json-schema/statusResponse';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import { HOST } from './constants';

interface SongList {
  songs: Song[];
}

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private getSongListUrl = `http://${HOST}:3000/songlist`;
  private updateCurrentSongUrl = `http://${HOST}:3000/currentsong/update`;
  private getSongChordsLyricsUrl = `http://${HOST}:3000/songlyrics`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getSongList(): Observable<SongList> {
    const songList: Observable<SongList> = this.http
      .get<SongList>(this.getSongListUrl)
      .pipe(
        tap((_) => this.log('fetched song list')),
        catchError(this.handleError<SongList>('getSongList'))
      );
    return songList;
  }

  getChordsLyrics(artist: string, title: string): Observable<string> {
    let options: { params?: HttpParams; responseType: 'text' } = {
      params: new HttpParams().append('artist', artist).append('title', title),
      responseType: 'text',
    };

    let chordsLyrics: Observable<string> = this.http
      .get(this.getSongChordsLyricsUrl, options)
      .pipe(
        tap((_) => this.log('fetched song chords/lyrics')),
        catchError(this.handleError<string>('getSongChordsLyrics'))
      );

    return chordsLyrics;
  }

  setCurrentSong(currentSong: Song): Observable<StatusResponse> {
    const currentSongString: string = JSON.stringify(currentSong);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const updateStatusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.updateCurrentSongUrl,
        currentSongString,
        httpOptions
      )
      .pipe(
        tap((_) => this.log('fetched current song')),
        catchError(this.handleError<StatusResponse>('setCurrentSong'))
      );

    return updateStatusResponse;
  }

  /** Log a SongService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`SongService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
