import { Component, OnInit } from '@angular/core';
import { SsQueueEntry } from '../../json-schema/ss-objects'
import { MessageService } from '../message.service';
import { SsService } from '../ss.service';

@Component({
  selector: 'app-ss-queue',
  templateUrl: './ss-queue.component.html',
  styleUrls: ['./ss-queue.component.css'],
})
export class SsQueueComponent implements OnInit {
  entries?: SsQueueEntry[];
  success?: boolean;

  constructor(
    private ssService: SsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getSongQueue();
  }

  getHeaderRowDivClass() {
    return {
      'rowHeader': true
    }
  }

  getRowDivClass(active: boolean) {
    return {
      'rowActive': active,
      'rowInactive': !active
    }
  }

  getHeaderCellDivClass(fixed: boolean) {
    return {
      'cellHeader': true,
      'cellFixedWidth': fixed
    }
  }

  getCellDivClass(active: boolean, fixed: boolean) {
    return {
      'cellActive': active,
      'cellInactive': !active,
      'cellFixedWidth': fixed
    }
  }

  getSongQueue(): void {
    this.ssService
      .getQueue()
      .subscribe(
        (songQueue) => {
          this.entries = songQueue.list.sort(x => x.position)
          this.logSuccess('Fetched song queue');
        }
      );
  }

  markAsPlayed(entry: SsQueueEntry) {
    this.logFailure("markAsPlayed not yet implemented")
  }

  removeFromQueue(entry: SsQueueEntry) {
    this.logFailure("removeFromQueue not yet implemented")
  }

  private logFailure(message: string) {
    this.messageService.logFailure(message, this.constructor.name);
  }

  private logSuccess(message: string) {
    this.messageService.logSuccess(message, this.constructor.name);
  }

  private logInfo(message: string) {
    this.messageService.logInfo(message, this.constructor.name);
  }

  private logVerbose(message: string) {
    this.messageService.logVerbose(message, this.constructor.name);
  }
}