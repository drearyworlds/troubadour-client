import { Injectable } from '@angular/core';
import { SsQueueEntry } from '../json-schema/ss-objects';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, tap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';
import { StatusResponse } from '../json-schema/statusResponse';

interface SongQueue {
  list: SsQueueEntry[];
}

@Injectable({
  providedIn: 'root',
})
export class SsService {
  private static URL_GET_QUEUE: string = `https://api.streamersonglist.com/v1/streamers/drearyworlds/queue`;
  private static URL_MARK_QUEUE_ENTRY_AS_PLAYED: string = `https://api.streamersonglist.com/v1/streamers/drearyworlds/queue/{queueId}/played`

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private configService: ConfigurationService
  ) { }

  getQueue(): Observable<SongQueue> {
    const songQueue: Observable<SongQueue> = this.http
      .get<SongQueue>(SsService.URL_GET_QUEUE)
      .pipe(
        tap((_) => this.logVerbose('Fetched song queue')),
        catchError(this.handleError<SongQueue>('getSongQueue'))
      );
    return songQueue;
  }

  markAsPlayed(entry: SsQueueEntry) : Observable<StatusResponse> {
    let id: any = entry.id;
    const url = SsService.URL_MARK_QUEUE_ENTRY_AS_PLAYED.replace(/{queueId}/g, id);

    this.logVerbose(`id: ${id}`)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.configService.streamerSonglistToken}`
      }),
    };

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        url,
        null,
        httpOptions)
      .pipe(
        tap((_) => this.logVerbose(`Marked entry (${id}) as played`)),
        catchError(this.handleError<StatusResponse>('markAsPlayed'))
      );

    this.logVerbose(`markAsPlayed response: ${statusResponse}`)

    return statusResponse;
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