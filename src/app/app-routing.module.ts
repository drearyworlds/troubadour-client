import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { DrinkListComponent } from './drink-list/drink-list.component';

const routes: Routes = [
  { path: 'song-list', component: SongListComponent },
  { path: 'drink-list', component: DrinkListComponent },
  { path: '', redirectTo: '/songlist', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }