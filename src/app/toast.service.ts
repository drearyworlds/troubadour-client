import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr'

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastrService: ToastrService) {
  }

  success(message: string, title?: string) {
    if (!title) {
      this.toastrService.success(message, "Success")
    } else {
      this.toastrService.success(message, title)
    }
  }

  failure(message: string, title?: string) {
    if (!title) {
      this.toastrService.error(message, "Failure")
    } else {
      this.toastrService.error(message, title)
    }
  }

  info(message: string, title?: string) {
    if (!title) {
      this.toastrService.info(message, "Info")
    } else {
      this.toastrService.info(message, title)
    }
  }
}