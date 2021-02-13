import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { DrinkListComponent } from './drink-list/drink-list.component';
import { LyricsComponent } from './lyrics/lyrics.component';

const routes: Routes = [
  { path: 'song-list', component: SongListComponent },
  { path: 'drink-list', component: DrinkListComponent },
  { path: 'lyrics/:artist/:title', component: LyricsComponent },
  { path: '', redirectTo: '/song-list', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  providers: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }