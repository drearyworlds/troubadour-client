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
    private localStorageService: LocalStorageService) {
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

  isEditMode(): boolean {
    return this.localStorageService.isEditMode();
  }

  setEditMode(value: boolean): void {
    this.localStorageService.setEditMode(value);
  }
}