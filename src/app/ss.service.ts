import { Injectable } from '@angular/core';
import { SsQueueEntry, SsSong } from '../json-schema/ss-objects';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LogService, LogLevel } from './log.service'
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

  private URL_GET_SONGLIST: string = `http://${this.configService.getServerHost()}:${this.configService.getServerPort()}/ss/list`
  private URL_GET_QUEUE: string = `http://${this.configService.getServerHost()}:${this.configService.getServerPort()}/ss/queue`
  private URL_ADD_TO_QUEUE: string = `http://${this.configService.getServerHost()}:${this.configService.getServerPort()}/ss/queue/add`
  private URL_REMOVE_FROM_QUEUE: string = `http://${this.configService.getServerHost()}:${this.configService.getServerPort()}/ss/queue/remove`
  private URL_MARK_QUEUE_ENTRY_AS_PLAYED: string = `http://${this.configService.getServerHost()}:${this.configService.getServerPort()}/ss/queue/mark`
  private URL_UPDATE_SONG: string = `http://${this.configService.getServerHost()}:${this.configService.getServerPort()}/ss/song`;
  private URL_ADD_SONG: string = this.URL_UPDATE_SONG;

  constructor(
    private http: HttpClient,
    private logService: LogService,
    private configService: ConfigurationService,
  ) {
  }

  getSongList(): Observable<SsSongList> {
    const methodName = this.getSongList.name;

    let songList: Observable<SsSongList> = this.http
      .get<SsSongList>(this.URL_GET_SONGLIST)
      .pipe(
        tap((_) => this.log(LogLevel.Verbose, 'Fetched song list', methodName)),
        catchError(this.handleError<SsSongList>(`getSongList from ${this.URL_GET_SONGLIST}`))
      );
    return songList;
  }

  updateSong(ssSong: SsSong): Observable<SsSong> {
    const methodName = this.updateSong.name;

    this.log(LogLevel.Verbose, `id: ${ssSong.id}`, methodName);

    let url = this.URL_UPDATE_SONG;;
    this.log(LogLevel.Verbose, `url: ${url}`, methodName);

    const body = ssSong;

    this.log(LogLevel.Verbose, `body: ${JSON.stringify(body)}`, methodName);

    const songResponse: Observable<SsSong> = this.http
      .put<SsSong>(
        url,
        body)
      .pipe(
        tap((_) => {
          this.log(LogLevel.Verbose, `Updated song "${ssSong.title}"`, methodName);
          this.log(LogLevel.Verbose, `Update Song response: ${songResponse}`, methodName);
        }),
        catchError(this.handleError<SsSong>('updateSong'))
      );

    return songResponse;
  }

  addSong(ssSong: SsSong) {
    const methodName = this.addSong.name;

    this.log(LogLevel.Verbose, `id: ${ssSong.id}`, methodName);

    let url = this.URL_ADD_SONG;;
    this.log(LogLevel.Verbose, `url: ${url}`, methodName);

    const body = ssSong;

    this.log(LogLevel.Verbose, `body: ${JSON.stringify(body)}`, methodName);

    const songResponse: Observable<SsSong> = this.http
      .post<SsSong>(
        url,
        body)
      .pipe(
        tap((_) => {
          this.log(LogLevel.Verbose, `Added song "${ssSong.title}"`, methodName);
          this.log(LogLevel.Verbose, `Add Song response: ${songResponse}`, methodName);
        }),
        catchError(this.handleError<SsSong>('addSong'))
      );

    return songResponse;
  }

  getSongQueue(): Observable<SongQueue> {
    const methodName = this.getSongQueue.name;

    const songQueue: Observable<SongQueue> = this.http
      .get<SongQueue>(this.URL_GET_QUEUE)
      .pipe(
        tap((_) => this.log(LogLevel.Verbose, 'Fetched song queue', methodName)),
        catchError(this.handleError<SongQueue>('getSongQueue'))
      );
    return songQueue;
  }

  addToQueue(id: number): Observable<StatusResponse> {
    const methodName = this.addToQueue.name;

    this.log(LogLevel.Verbose, `id: ${id}`, methodName);

    const url = this.URL_ADD_TO_QUEUE;;
    this.log(LogLevel.Verbose, `url: ${url}`, methodName);

    let body = { songId: id }

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        url,
        body)
      .pipe(
        tap((_) => this.log(LogLevel.Verbose, `Added entry (${id}) to queue`, methodName)),
        catchError(this.handleError<StatusResponse>('addToQueue'))
      );

    this.log(LogLevel.Verbose, `addToQueue response: ${statusResponse}`, methodName);

    return statusResponse;
  }

  markAsPlayed(entry: SsQueueEntry): Observable<StatusResponse> {
    const methodName = this.markAsPlayed.name;

    let id: any = entry.id;
    this.log(LogLevel.Verbose, `id: ${id}`, methodName);

    const url = this.URL_MARK_QUEUE_ENTRY_AS_PLAYED;
    this.log(LogLevel.Verbose, `url: ${url}`, methodName);

    let body = { queueId: id }

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        url,
        body)
      .pipe(
        tap((_) => {
          this.log(LogLevel.Verbose, `Marked entry (${id}) as played`, methodName);
          this.getSongQueue()
        }),
        catchError(this.handleError<StatusResponse>('markAsPlayed'))
      );

    this.log(LogLevel.Verbose, `markAsPlayed response: ${statusResponse}`, methodName);

    return statusResponse;
  }

  removeFromQueue(entry: SsQueueEntry): Observable<StatusResponse> {
    const methodName = this.removeFromQueue.name;

    let id: any = entry.id;
    this.log(LogLevel.Verbose, `id: ${id}`, methodName);

    const url = this.URL_REMOVE_FROM_QUEUE;
    this.log(LogLevel.Verbose, `url: ${url}`, methodName);

    let body = { queueId: id }

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        url,
        body)
      .pipe(
        tap((_) => {
          this.log(LogLevel.Verbose, `Removed entry (${id}) from queue`, methodName);
          this.getSongQueue()
        }),
        catchError(this.handleError<StatusResponse>('removeFromQueue'))
      );

    this.log(LogLevel.Verbose, `removeFromQueue response: ${statusResponse}`, methodName);

    return statusResponse;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    const methodName = this.handleError.name;

    return (error: any): Observable<T> => {
      // Log the error
      this.log(LogLevel.Failure, `${operation} failed: ${error.message}`, methodName);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  log(logLevel: LogLevel, message: string, methodName: string) {
    this.logService.log(logLevel, message, this.constructor.name, methodName);
  }
}