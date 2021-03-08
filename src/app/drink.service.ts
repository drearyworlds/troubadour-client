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
  private getDrinkListUrl = `http://${this.config.serverHost}:${this.config.serverPort}/drinklist`;
  private updateCurrentDrinkUrl = `http://${this.config.serverHost}:${this.config.serverPort}/currentdrink/update`;
  private drinkList?: Observable<DrinkList>;
  private updateStatusResponse?: Observable<StatusResponse>;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private config: ConfigurationService,
  ) {}

  getDrinkList(): Observable<DrinkList> {
    this.drinkList = this.http.get<DrinkList>(this.getDrinkListUrl).pipe(
      tap((_) => this.logSuccess('Fetched drink list')),
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
        this.updateCurrentDrinkUrl,
        currentDrinkString,
        httpOptions
      )
      .pipe(
        tap((_) => this.logSuccess('Fetched current drink')),
        catchError(this.handleError<StatusResponse>('setCurrentDrink'))
      );

    return this.updateStatusResponse;
  }

  /** GET drink by id. Will 404 if id not found */
  // getDrink(id: number): Observable<Drink> {
  //   const url = `${this.getDrinkListUrl}/${id}`;

  //   return this.http.get<Drink>(url).pipe(
  //     tap(_ => this.log(`Fetched drink id=${id}`)),
  //     catchError(this.handleError<Drink>(`getDrink id=${id}`))
  //   );
  // }

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
