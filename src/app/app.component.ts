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

  isEditMode(): boolean {
    return this.localStorageService.isEditMode();
  }

  setEditMode(value: boolean): void {
    this.localStorageService.setEditMode(value);
  }
}