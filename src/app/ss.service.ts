import { Injectable } from '@angular/core';
import { SsQueueEntry, SsSong } from '../json-schema/ss-objects';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, tap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';
import { StatusResponse } from '../json-schema/statusResponse';
import { SsSongList } from '../json-schema/ss-objects'

interface SongQueue {
  list: SsQueueEntry[];
}

@Injectable({
  providedIn: 'root',
})
export class SsService {
  private static URL_GET_QUEUE: string = `https://api.streamersonglist.com/v1/streamers/drearyworlds/queue`;
  private static URL_GET_SONGLIST: string = `https://api.streamersonglist.com/v1/streamers/drearyworlds/songs`;
  private static URL_MARK_QUEUE_ENTRY_AS_PLAYED: string = `https://api.streamersonglist.com/v1/streamers/drearyworlds/queue/{queueId}/played`
  private static URL_ADD_TO_QUEUE: string = `https://api.streamersonglist.com/v1/streamers/drearyworlds/queue/{songId}/request`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private configService: ConfigurationService
  ) { }

  getSongList(): Observable<SsSongList> {
    let options: { params?: HttpParams; } = {
      params: new HttpParams()
        .append('size', "0")
        .append('current', "0")
        .append('showInactive', "false")
        .append('isNew', "false")
        .append('order', "asc")
    };

    let songList: Observable<SsSongList> = this.http
      .get<SsSongList>(SsService.URL_GET_SONGLIST, options)
      .pipe(
        tap((_) => this.logVerbose('Fetched song list')),
        catchError(this.handleError<SsSongList>('getSongList'))
      );
    return songList;
  }

  getQueue(): Observable<SongQueue> {
    const songQueue: Observable<SongQueue> = this.http
      .get<SongQueue>(SsService.URL_GET_QUEUE)
      .pipe(
        tap((_) => this.logVerbose('Fetched song queue')),
        catchError(this.handleError<SongQueue>('getSongQueue'))
      );
    return songQueue;
  }

  addToQueue(id: number): Observable<StatusResponse> {
    let idString = id.toString();
    this.logVerbose(`addToQueue: ${idString}`);

    const url = SsService.URL_ADD_TO_QUEUE.replace(/{songId}/g, idString);

    this.logVerbose(`url: ${url}`)
    this.logVerbose(`token: ${this.configService.streamerSonglistToken}`)

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
        tap((_) => this.logVerbose(`Added entry (${id}) to queue`)),
        catchError(this.handleError<StatusResponse>('addToQueue'))
      );

    this.logVerbose(`addToQueue response: ${statusResponse}`)

    return statusResponse;
  }

  markAsPlayed(entry: SsQueueEntry): Observable<StatusResponse> {
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
