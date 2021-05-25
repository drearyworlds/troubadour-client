import { Component } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private localStorageService: LocalStorageService) {
  }

  isEditMode(): boolean {
    return this.localStorageService.isEditMode();
  }

  setEditMode(value: boolean): void {
    this.localStorageService.setEditMode(value);
  }
}