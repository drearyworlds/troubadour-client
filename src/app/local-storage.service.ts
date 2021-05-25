import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public isEditMode(): boolean {
    return JSON.parse(localStorage.getItem('editMode') || "false");
  };

  public setEditMode(value: boolean): void {
    localStorage.setItem('editMode', value.toString());
  };
}