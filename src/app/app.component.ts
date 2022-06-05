import { Component } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private localStorageService: LocalStorageService,
    private router : Router) {
  }

  navigateBack() {
    window.history.back();
  }

  navigateForward() {
    window.history.forward();
  }

  refreshPage() {
    window.location.reload();
  }

  private modifyFontSize(amount: number) {
    let fontSize = getComputedStyle(document.documentElement).getPropertyValue('--default-font-size');
    fontSize = `${+(fontSize.slice(0, -2)) + amount}px`;
    document.documentElement.style.setProperty('--default-font-size', fontSize);
  }

  increaseFontSize() {
    this.modifyFontSize(1);
  }

  decreaseFontSize() {
    this.modifyFontSize(-1);
  }

  private modifyColumnCount(amount: number) {
    let columnCount = getComputedStyle(document.documentElement).getPropertyValue('--lyrics-column-count');
    columnCount = `${+(columnCount) + amount}`;
    document.documentElement.style.setProperty('--lyrics-column-count', columnCount);
  }

  increaseColumnCount() {
    this.modifyColumnCount(1);
  }

  decreaseColumnCount() {
    this.modifyColumnCount(-1);
  }

  navigateToRandomSong(): void {
    let songIsActive = false;
    let randomSongId = 0;
    let songs = this.localStorageService.getSongList();

    if (songs) {
      while (randomSongId == 0 || !songIsActive) {
        var randomSong = songs[Math.floor(Math.random() * songs.length)]

        if (randomSong.active) {
          randomSongId = randomSong.id;
          songIsActive = randomSong.active;
        }
      }

      if (randomSongId != 0) {
        this.router.navigate(['/lyrics', randomSongId]);
      }
    }
  }
  
  getNextValidSongId(): number {
    const methodName = this.getNextValidSongId.name;
    let returnValue = 0

    let songs = this.localStorageService.getSongList();

    if (songs) {
      for (let song of songs) {
        if (song.id > returnValue) {
          returnValue = song.id;
        }
      }
    }

    return returnValue;
  }

  isEditMode(): boolean {
    return this.localStorageService.isEditMode();
  }

  setEditMode(value: boolean): void {
    this.localStorageService.setEditMode(value);
  }
}