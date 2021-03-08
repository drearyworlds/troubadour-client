import { Component, OnInit } from '@angular/core';
import { SsQueueEntry } from '../../json-schema/ss-objects'
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

  getHeaderCellDivClass(fixed : boolean) {
    return {
      'cellHeader': true,
      'cellFixedWidth': fixed
    }
  }

  getCellDivClass(active: boolean, fixed : boolean) {
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
        (songQueue) => (this.entries = songQueue.list.sort(x=>x.position))
      );
  }

  markAsPlayed(entry: SsQueueEntry) {
    alert("mock mark as played")
  }

  removeFromQueue(entry: SsQueueEntry) {
    alert("mock remove from queue")
  }
}