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

  private URL_GET_SONGLIST: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/ss/list`
  private URL_GET_QUEUE: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/ss/queue`
  private URL_ADD_TO_QUEUE: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/ss/queue/add`
  private URL_REMOVE_FROM_QUEUE: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/ss/queue/remove`
  private URL_MARK_QUEUE_ENTRY_AS_PLAYED: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/ss/queue/mark`

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private configService: ConfigurationService,
  ) { }

  getSongList(): Observable<SsSongList> {
    let songList: Observable<SsSongList> = this.http
      .get<SsSongList>(this.URL_GET_SONGLIST)
      .pipe(
        tap((_) => this.logVerbose('Fetched song list')),
        catchError(this.handleError<SsSongList>(`getSongList from ${this.URL_GET_SONGLIST}`))
      );
    return songList;
  }

  getSongQueue(): Observable<SongQueue> {
    const songQueue: Observable<SongQueue> = this.http
      .get<SongQueue>(this.URL_GET_QUEUE)
      .pipe(
        tap((_) => this.logVerbose('Fetched song queue')),
        catchError(this.handleError<SongQueue>('getSongQueue'))
      );
    return songQueue;
  }

  addToQueue(id: number): Observable<StatusResponse> {
    this.logVerbose(`addToQueue: ${id}`);

    let url = this.URL_ADD_TO_QUEUE;;
    this.logVerbose(`url: ${url}`)

    let body = { songId: id }

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        url,
        body)
      .pipe(
        tap((_) => this.logVerbose(`Added entry (${id}) to queue`)),
        catchError(this.handleError<StatusResponse>('addToQueue'))
      );

    this.logVerbose(`addToQueue response: ${statusResponse}`)

    return statusResponse;
  }

  markAsPlayed(entry: SsQueueEntry): Observable<StatusResponse> {
    let id: any = entry.id;
    this.logVerbose(`id: ${id}`)

    const url = this.URL_MARK_QUEUE_ENTRY_AS_PLAYED;
    this.logVerbose(`url: ${url}`)

    let body = { queueId: id }

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        url,
        body)
      .pipe(
        tap((_) => {
          this.logVerbose(`Marked entry (${id}) as played`)
          this.getSongQueue()
        }),
        catchError(this.handleError<StatusResponse>('markAsPlayed'))
      );

    this.logVerbose(`markAsPlayed response: ${statusResponse}`)

    return statusResponse;
  }

  removeFromQueue(entry: SsQueueEntry): Observable<StatusResponse> {
    let id: any = entry.id;
    this.logVerbose(`id: ${id}`)

    const url = this.URL_REMOVE_FROM_QUEUE;
    this.logVerbose(`url: ${url}`)

    let body = { queueId: id }

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        url,
        body)
      .pipe(
        tap((_) => {
          this.logVerbose(`Removed entry (${id}) from queue`)
          this.getSongQueue()
        }),
        catchError(this.handleError<StatusResponse>('removeFromQueue'))
      );

    this.logVerbose(`removeFromQueue response: ${statusResponse}`)

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
