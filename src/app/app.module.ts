import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SongListComponent } from './song-list/song-list.component';
import { DrinkListComponent } from './drink-list/drink-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ChordsLyricsComponent } from './chords-lyrics/chords-lyrics.component';

@NgModule({
  declarations: [
    AppComponent,
    SongListComponent,
    DrinkListComponent,
    MessagesComponent,
    ChordsLyricsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
