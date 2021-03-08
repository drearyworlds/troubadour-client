import { Injectable } from '@angular/core';
import { ToastService } from './toast.service'

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  constructor(private toastService : ToastService) {
  }

  logFailure(message: string, fromClass : string) {
    const formattedMessage = `[${fromClass}] ${message}`;
    this.messages.push(`Failure: ${formattedMessage}`);

    // Toast failure
    this.toastService.failure(message)

    // Log failure to console
    console.error(formattedMessage);
  }

  logSuccess(message: string, fromClass : string) {
    const formattedMessage = `[${fromClass}] ${message}`;
    this.messages.push(`Success: ${formattedMessage}`);

    // Toast success
    this.toastService.success(message)

    // Don't log success to console
  }

  logInfo(message: string, fromClass : string) {
    const formattedMessage = `[${fromClass}] ${message}`;
    this.messages.push(`Info: ${formattedMessage}`);

    // Toast info
    this.toastService.info(message)

    // Don't log info to console
  }

  logVerbose(message: string, fromClass : string) {
    const formattedMessage = `[${fromClass}] ${message}`;
    this.messages.push(`Verbose: ${formattedMessage}`);

    // Don't toast verbose
    
    // Don't log verbose to console
  }

  clear() {
    this.messages = [];
  }
}