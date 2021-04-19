import { Injectable } from '@angular/core';
import { ToastService } from './toast.service'

export enum LogLevel {
  Verbose, Info, Success, Warning, Failure
}

@Injectable({
  providedIn: 'root',
})
export class LogService {
  messages: string[] = [];

  constructor(private toastService: ToastService) {
  }

  log(level: LogLevel, message: string, className: string) {
    let logMessage = message;
    let toastMessage: string = `[${className}] ${message}`;

    switch (level) {
      case LogLevel.Verbose:
        logMessage = `Verbose: ${logMessage}`
        break;
      case LogLevel.Info:
        logMessage = `Info: ${logMessage}`
        this.toastService.info(toastMessage)
        break;
      case LogLevel.Success:
        logMessage = `Success: ${logMessage}`
        this.toastService.success(toastMessage)
        break;
      case LogLevel.Warning:
        logMessage = `Warning: ${logMessage}`
        break;
      case LogLevel.Failure:
        logMessage = `${message}`
        logMessage = `Failure: ${logMessage}`
        this.toastService.failure(toastMessage)
        break;
    }

    this.messages.push(`[${className}] ${logMessage}`);
  }

  clear() {
    this.messages = [];
  }
}