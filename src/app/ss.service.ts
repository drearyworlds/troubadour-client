import { Injectable } from '@angular/core';
import { SsQueueEntry } from '../json-schema/ss-objects';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, tap } from 'rxjs/operators';

interface SongQueue {
  list: SsQueueEntry[];
}

@Injectable({
  providedIn: 'root',
})
export class SsService {
  private URL_GET_SS_QUEUE: string = `https://api.streamersonglist.com/v1/streamers/drearyworlds/queue`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  getQueue(): Observable<SongQueue> {
    const songQueue: Observable<SongQueue> = this.http
      .get<SongQueue>(this.URL_GET_SS_QUEUE)
      .pipe(
        tap((_) => this.logVerbose('Fetched song queue')),
        catchError(this.handleError<SongQueue>('getSongQueue'))
      );
    return songQueue;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Log the error
      this.logFailure(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
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
