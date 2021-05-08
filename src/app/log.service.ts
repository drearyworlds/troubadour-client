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

  log(level: LogLevel, message: string, className: string, methodName?: string) {
    let logMessage = message;

    switch (level) {
      case LogLevel.Verbose:
        logMessage = `Verbose: ${logMessage}`
        break;
      case LogLevel.Info:
        logMessage = `Info: ${logMessage}`
        this.toastService.info(logMessage)
        break;
      case LogLevel.Success:
        logMessage = `Success: ${logMessage}`
        this.toastService.success(logMessage)
        break;
      case LogLevel.Warning:
        logMessage = `Warning: ${logMessage}`
        break;
      case LogLevel.Failure:
        logMessage = `${message}`
        logMessage = `Failure: ${logMessage}`
        this.toastService.failure(logMessage)
        break;
    }

    logMessage = `[${className}] [${methodName}] ${logMessage}`;
    
    this.messages.push(logMessage);
  }

  clear() {
    this.messages = [];
  }
}