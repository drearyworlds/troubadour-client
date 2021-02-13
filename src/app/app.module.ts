import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SongListComponent } from './song-list/song-list.component';
import { DrinkListComponent } from './drink-list/drink-list.component';
import { MessagesComponent } from './messages/messages.component';
import { LyricsComponent } from './lyrics/lyrics.component';
import { APP_INITIALIZER } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { of, Observable, ObservableInput } from '../../node_modules/rxjs';
import { map, catchError } from 'rxjs/operators';

function load(http: HttpClient, config: ConfigurationService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
       http.get('./config.json')
         .pipe(
           map((x: ConfigurationService) => {
             console.log("Found the config.json")
             config.serverHost = x.serverHost;
             config.serverPort = x.serverPort;

             resolve(true);
           }),
           catchError((x: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
             if (x.status !== 404) {
               resolve(false);
             }
             config.serverHost = 'localhost';
             config.serverPort = 3000;
             resolve(true);
             return of({});
           })
         ).subscribe();
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    SongListComponent,
    DrinkListComponent,
    MessagesComponent,
    LyricsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: load,
    multi: true,
    deps: [
      HttpClient,
      ConfigurationService
    ],
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
