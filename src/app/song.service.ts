import { Injectable } from '@angular/core';
import { Song } from './song';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SongService {
  // URL to web api
  private songListUrl = 'api/songs';
  private songList?: Observable<Song[]>;

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getSongList(): Observable<Song[]> {
    this.songList = this.http.get<Song[]>(this.songListUrl)
    .pipe(
      tap(_ => this.log('fetched song list')),
      catchError(this.handleError<Song[]>('getSongList', []))
    );
    return this.songList;
  }

  /** GET song by id. Will 404 if id not found */
  getSong(id: number): Observable<Song> {
    const url = `${this.songListUrl}/${id}`;

    return this.http.get<Song>(url).pipe(
      tap(_ => this.log(`fetched song id=${id}`)),
      catchError(this.handleError<Song>(`getSong id=${id}`))
    );
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