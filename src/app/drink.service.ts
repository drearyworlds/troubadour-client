import { Injectable } from '@angular/core';
import { Drink } from '../json-schema/drink';
import { StatusResponse } from '../json-schema/statusResponse';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LogService } from './log.service';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

interface DrinkList {
  drinks: Drink[];
}

@Injectable({
  providedIn: 'root',
})

export class DrinkService {
  private URL_DRINK_LIST: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/drink/list`;
  private URL_UPDATE_CURRENT_DRINK: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/drink/current`;
  private URL_DRINK_DATA: string = `http://${this.configService.serverHost}:${this.configService.serverPort}/drink/data`;

  private drinkList?: Observable<DrinkList>;
  private updateStatusResponse?: Observable<StatusResponse>;

  constructor(
    private http: HttpClient,
    private logService: LogService,
    private configService: ConfigurationService,
  ) {
    this.logService.className = this.constructor.name;
  }

  getList(): Observable<DrinkList> {
    this.drinkList = this.http.get<DrinkList>(this.URL_DRINK_LIST).pipe(
      tap((_) => this.logService.logVerbose('Fetched drink list')),
      catchError(this.handleError<DrinkList>('getDrinkList'))
    );
    return this.drinkList;
  }

  setCurrentDrink(currentDrink: Drink): Observable<StatusResponse> {
    const currentDrinkString: string = JSON.stringify(currentDrink);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.updateStatusResponse = this.http
      .post<StatusResponse>(
        this.URL_UPDATE_CURRENT_DRINK,
        currentDrinkString,
        httpOptions
      )
      .pipe(
        tap((_) => this.logService.logVerbose('Fetched current drink')),
        catchError(this.handleError<StatusResponse>('setCurrentDrink'))
      );

    return this.updateStatusResponse;
  }

  getDataByDrinkId(drinkId: number): Observable<string> {
    let options: { params?: HttpParams; responseType: 'text' } = {
      params: new HttpParams().append('id', drinkId.toString()),
      responseType: 'text',
    };

    let drinkData: Observable<string> = this.http
      .get(this.URL_DRINK_DATA, options)
      .pipe(
        tap((_) => this.logService.logVerbose('Fetched drink data')),
        catchError(this.handleError<string>('getData'))
      );

    return drinkData;
  }

  saveDrinkData(drinkToSave : Drink) {
    const drinkToSaveString: string = JSON.stringify(drinkToSave);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const updateStatusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_DRINK_DATA,
        drinkToSaveString,
        httpOptions
      )
      .pipe(
        tap((_) => this.logService.logVerbose('Saved current drink')),
        catchError(this.handleError<StatusResponse>('saveDrinkData'))
      );

    return updateStatusResponse;
  }

  async importDrinkList(drinkListFile: File): Promise<Observable<StatusResponse>> {
    this.logService.logVerbose("importDrinkList")
    this.logService.logVerbose(`drinkListFile: ${drinkListFile}`)
    let drinkList = await drinkListFile.text();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const updateStatusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_DRINK_LIST,
        drinkList,
        httpOptions
      )
      .pipe(
        tap((_) => this.logService.logVerbose('Imported drink list')),
        catchError(this.handleError<StatusResponse>('importDrinkList'))
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
      // Log the error
      this.logService.logFailure(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
