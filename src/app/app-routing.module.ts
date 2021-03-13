import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SsQueueComponent } from './ss-queue/ss-queue.component';
import { SongListComponent } from './song-list/song-list.component';
import { DrinkListComponent } from './drink-list/drink-list.component';
import { LyricsComponent } from './lyrics/lyrics.component';
import { EditSongComponent } from './edit-song/edit-song.component'
import { EditDrinkComponent } from './edit-drink/edit-drink.component'
import { ImportExportComponent } from './import-export/import-export.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  { path: 'ss-queue', component: SsQueueComponent },
  { path: 'song-list', component: SongListComponent },
  { path: 'drink-list', component: DrinkListComponent },
  { path: 'lyrics/:id', component: LyricsComponent },
  { path: 'edit-song/:id', component: EditSongComponent },
  { path: 'edit-drink/:id', component: EditDrinkComponent },
  { path: 'import-export', component: ImportExportComponent },
  { path: 'messages', component: MessagesComponent },
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