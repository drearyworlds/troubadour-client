import { Component, OnInit } from '@angular/core';
import { LogService } from '../log.service'

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(public logService: LogService) {
    this.logService.className = "Messages"
  }

  ngOnInit(): void {
  }

  logServiceMessage() : Array<string> {
    return LogService.messages;
  }
}