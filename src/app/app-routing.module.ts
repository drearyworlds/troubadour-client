import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { DrinkListComponent } from './drink-list/drink-list.component';
import { ChordsLyricsComponent } from './chords-lyrics/chords-lyrics.component';

const routes: Routes = [
  { path: 'song-list', component: SongListComponent },
  { path: 'drink-list', component: DrinkListComponent },
  { path: 'chords-lyrics/:artist/:title', component: ChordsLyricsComponent },
  { path: '', redirectTo: '/song-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }