import { Injectable } from '@angular/core';
import { Song } from '../json-schema/song';
import { SongList } from '../json-schema/song-list'
import { StatusResponse } from '../json-schema/statusResponse';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, tap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private URL_SONG_LIST: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/song/list`;
  private URL_UPDATE_CURRENT_SONG: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/song/current`;
  private URL_SONG_DATA: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/song/data`;
  private URL_GET_SONG_LYRICS: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/song/lyrics`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private configService: ConfigurationService
  ) { }

  getList(): Observable<SongList> {
    const songList: Observable<SongList> = this.http
      .get<SongList>(this.URL_SONG_LIST)
      .pipe(
        tap((_) => this.logVerbose('Fetched song list')),
        catchError(this.handleError<SongList>('getSongList'))
      );
    return songList;
  }

  getDataBySongId(songId: number): Observable<string> {
    let options: { params?: HttpParams; responseType: 'text' } = {
      params: new HttpParams().append('id', songId.toString()),
      responseType: 'text',
    };

    let songData: Observable<string> = this.http
      .get(this.URL_SONG_DATA, options)
      .pipe(
        tap((_) => this.logVerbose('Fetched song data')),
        catchError(this.handleError<string>('getData'))
      );

    return songData;
  }

  getDataByArtistTitle(artist: string, title: string): Observable<string> {
    let options: { params?: HttpParams; responseType: 'text' } = {
      params: new HttpParams().append('artist', artist.toString()).append('title', title.toString()),
      responseType: 'text',
    };

    let songData: Observable<string> = this.http
      .get(this.URL_SONG_DATA, options)
      .pipe(
        tap((_) => this.logVerbose('Fetched data')),
        catchError(this.handleError<string>('getData'))
      );

    return songData;
  }

  getLyrics(songId: number): Observable<string> {
    let options: { params?: HttpParams; responseType: 'text' } = {
      params: new HttpParams().append('id', songId.toString()),
      responseType: 'text',
    };

    let lyrics: Observable<string> = this.http
      .get(this.URL_GET_SONG_LYRICS, options)
      .pipe(
        tap((_) => this.logVerbose('Fetched lyrics')),
        catchError(this.handleError<string>('getLyrics'))
      );

    return lyrics;
  }

  saveSongData(songToSave : Song) {
    const songToSaveString: string = JSON.stringify(songToSave);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const updateStatusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_SONG_DATA,
        songToSaveString,
        httpOptions
      )
      .pipe(
        tap((_) => this.logVerbose('Saved current song')),
        catchError(this.handleError<StatusResponse>('saveSongData'))
      );

    return updateStatusResponse;
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
        this.URL_UPDATE_CURRENT_SONG,
        currentSongString,
        httpOptions
      )
      .pipe(
        tap((_) => this.logVerbose(`Set current song to ${currentSong.title}`)),
        catchError(this.handleError<StatusResponse>('setCurrentSong'))
      );

    return updateStatusResponse;
  }

  async importSongList(songListFile: File): Promise<Observable<StatusResponse>> {
    this.logVerbose("importSongList")
    this.logVerbose(`songListFile: ${songListFile}`)
    let songList = await songListFile.text();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const updateStatusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_SONG_LIST,
        songList,
        httpOptions
      )
      .pipe(
        tap((_) => this.logVerbose('Imported song list')),
        catchError(this.handleError<StatusResponse>('importSongList'))
      );

    return updateStatusResponse;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Log failure
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
