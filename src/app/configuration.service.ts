import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    public serverHost?: string = "localhost";
    public serverPort?: number = 3000

    constructor() {
    }
}