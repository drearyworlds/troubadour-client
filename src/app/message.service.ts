import { Injectable } from '@angular/core';
import * as saveAs from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    let file = new Blob(this.messages, { type: 'text/txt;charset=utf-8' });
    saveAs(file, 'messages.txt')
    this.messages = [];
  }
}