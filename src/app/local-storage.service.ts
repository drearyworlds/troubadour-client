import { Injectable } from '@angular/core';
import { Song } from '../json-schema/song';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public isEditMode(): boolean {
    var item = localStorage.getItem('editMode');
    // Convert from string to bool
    return JSON.parse(item || "false");
  };

  public setEditMode(value: boolean): void {
    localStorage.setItem('editMode', value.toString());
  };

  public getSongList() : Song[] {
    var item = localStorage.getItem('songList');
    // Convert from string to array
    return JSON.parse(item || "{}");
  }

  public setSongList(songList: Song[]) {
    var songListJson = JSON.stringify(songList);
    console.log(songListJson);
    localStorage.setItem('songList', songListJson);
  }
}