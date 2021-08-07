import { Injectable } from '@angular/core';
import { Song } from '../json-schema/song';
import { SongQueue, QueueEntry } from '../json-schema/song-queue'
import { StatusResponse } from '../json-schema/statusResponse';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LogService, LogLevel } from './log.service'
import { catchError, tap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private URL_SONG: string = `http://${this.configService.getServerHost()}:${this.configService.getServerPort()}/song`;
  private URL_SONG_LIST: string = `${this.URL_SONG}/list`;
  private URL_UPDATE_CURRENT_SONG: string = `${this.URL_SONG}/current`;
  private URL_GET_QUEUE: string = `${this.URL_SONG}/queue`
  private URL_ADD_TO_QUEUE: string = `${this.URL_SONG}/queue/add`
  private URL_REMOVE_FROM_QUEUE: string = `${this.URL_SONG}/queue/remove`
  private URL_MARK_QUEUE_ENTRY_AS_PLAYED: string = `${this.URL_SONG}/queue/mark`
  private URL_MARK_NON_QUEUE_SONG_AS_PLAYED: string = `${this.URL_SONG}/mark`

  private HTTP_OPTIONS_POST = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private logService: LogService,
    private configService: ConfigurationService
  ) {
  }

  getList(): Observable<Song[]> {
    const methodName = this.getList.name;
    const songList: Observable<Song[]> = this.http
      .get<Song[]>(this.URL_SONG_LIST)
      .pipe(
        tap((_) => this.log(LogLevel.Verbose, 'Fetched song list', methodName)),
        catchError(this.handleError<Song[]>('getSongList'))
      );
    return songList;
  }

  getSongById(songId: number): Observable<string> {
    const methodName = this.getSongById.name;
    this.log(LogLevel.Verbose, `Fetching song for ID: ${songId}`, methodName);

    let options: { params?: HttpParams; responseType: 'text' } = {
      params: new HttpParams().append('id', songId.toString()),
      responseType: 'text',
    };

    const songData: Observable<string> = this.http
      .get(this.URL_SONG, options)
      .pipe(
        tap((_) => this.log(LogLevel.Verbose, `Fetched song`, methodName)),
        catchError(this.handleError<string>('getSongById'))
      );

    return songData;
  }

  saveSong(songToSave: Song) {
    const methodName = this.saveSong.name;

    const body = songToSave;

    this.log(LogLevel.Verbose, "body: " + JSON.stringify(songToSave), methodName);

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_SONG,
        body,
        this.HTTP_OPTIONS_POST
      )
      .pipe(
        tap((_) => this.log(LogLevel.Verbose, 'Saved current song', methodName)),
        catchError(this.handleError<StatusResponse>('saveSong'))
      );

    return statusResponse;
  }

  setCurrentSong(currentSong: Song): Observable<StatusResponse> {
    const methodName = this.setCurrentSong.name;
    const body = currentSong;

    this.log(LogLevel.Warning, "body: " + JSON.stringify(body), methodName);

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_UPDATE_CURRENT_SONG,
        body,
        this.HTTP_OPTIONS_POST
      )
      .pipe(
        tap((_) => this.log(LogLevel.Verbose, `Set current song to ${currentSong.title}`, methodName)),
        catchError(this.handleError<StatusResponse>('setCurrentSong'))
      );

    return statusResponse;
  }

  async importSongList(songListFile: File): Promise<Observable<StatusResponse>> {
    const methodName = this.importSongList.name;
    this.log(LogLevel.Verbose, "importSongList", methodName)
    this.log(LogLevel.Verbose, `songListFile: ${songListFile}`, methodName)
    let body = await songListFile.text();

    this.log(LogLevel.Warning, "body: " + JSON.stringify(body), methodName);

    const updateStatusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_SONG_LIST,
        body,
        this.HTTP_OPTIONS_POST
      )
      .pipe(
        tap((_) => this.log(LogLevel.Verbose, 'Imported song list', methodName)),
        catchError(this.handleError<StatusResponse>('importSongList'))
      );

    return updateStatusResponse;
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

  addToQueue(song: Song): Observable<StatusResponse> {
    const methodName = this.addToQueue.name;

    this.log(LogLevel.Verbose, `id: ${song.id}`, methodName);

    let body = { songId: song.id }

    this.log(LogLevel.Warning, "body: " + JSON.stringify(body), methodName);

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_ADD_TO_QUEUE,
        body,
        this.HTTP_OPTIONS_POST
      )
      .pipe(
        tap((_) => this.log(LogLevel.Verbose, `Added entry (${song.id}) to queue`, methodName)),
        catchError(this.handleError<StatusResponse>('addToQueue'))
      );

    this.log(LogLevel.Verbose, `addToQueue response: ${statusResponse}`, methodName);

    return statusResponse;
  }

  markAsPlayed(entry: QueueEntry): Observable<StatusResponse> {
    const methodName = this.markAsPlayed.name;

    let id: any = entry.id;
    this.log(LogLevel.Verbose, `id: ${id}`, methodName);

    let body = { queueId: id }

    this.log(LogLevel.Warning, "body: " + JSON.stringify(body), methodName);

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_MARK_QUEUE_ENTRY_AS_PLAYED,
        body,
        this.HTTP_OPTIONS_POST
      )
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

  markNonQueueSongAsPlayed(songId: number): Observable<StatusResponse> {
    const methodName = this.markNonQueueSongAsPlayed.name;

    this.log(LogLevel.Verbose, `songId: ${songId}`, methodName);

    let body = { songId: songId }

    this.log(LogLevel.Warning, "body: " + JSON.stringify(body), methodName);

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_MARK_NON_QUEUE_SONG_AS_PLAYED,
        body,
        this.HTTP_OPTIONS_POST
      )
      .pipe(
        tap((_) => {
          this.log(LogLevel.Verbose, `Marked non-queue song (${songId}) as played`, methodName);
        }),
        catchError(this.handleError<StatusResponse>('markNonQueueSongAsPlayed'))
      );

    return statusResponse;
  }

  removeFromQueue(entry: QueueEntry): Observable<StatusResponse> {
    const methodName = this.removeFromQueue.name;

    let id: any = entry.id;
    this.log(LogLevel.Verbose, `id: ${id}`, methodName);

    let body = { queueId: id }

    this.log(LogLevel.Verbose, "body: " + JSON.stringify(body), methodName);

    const statusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_REMOVE_FROM_QUEUE,
        body,
        this.HTTP_OPTIONS_POST
      )
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
      // Log failure
      this.log(LogLevel.Failure, `${operation} failed: ${error.message}`, methodName);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  log(logLevel: LogLevel, message: string, methodName: string) {
    this.logService.log(logLevel, message, this.constructor.name, methodName)
  }
}
