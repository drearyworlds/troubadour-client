import { Injectable } from '@angular/core';
import { Drink } from '../json-schema/drink';
import { StatusResponse } from '../json-schema/statusResponse';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

interface DrinkList {
  drinks: Drink[];
}

@Injectable({
  providedIn: 'root',
})

export class DrinkService {
  private URL_DRINK_LIST: string = `http://${this.config.serverHost}:${this.config.serverPort}/drink/list`;
  private URL_UPDATE_CURRENT_DRINK: string = `http://${this.config.serverHost}:${this.config.serverPort}/drink/current`;
  private drinkList?: Observable<DrinkList>;
  private updateStatusResponse?: Observable<StatusResponse>;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private config: ConfigurationService,
  ) {}

  getList(): Observable<DrinkList> {
    this.drinkList = this.http.get<DrinkList>(this.URL_DRINK_LIST).pipe(
      tap((_) => this.logVerbose('Fetched drink list')),
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
        tap((_) => this.logVerbose('Fetched current drink')),
        catchError(this.handleError<StatusResponse>('setCurrentDrink'))
      );

    return this.updateStatusResponse;
  }

  async importDrinkList(drinkListFile: File): Promise<Observable<StatusResponse>> {
    this.logVerbose("importDrinkList")
    this.logVerbose(`drinkListFile: ${drinkListFile}`)
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
        tap((_) => this.logVerbose('Imported drink list')),
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
