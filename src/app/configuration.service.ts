import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    // Note: These values are not currently being read from the config.json
    public serverHost?: string = "localhost";
    public serverPort?: number = 3000

    constructor() {
    }
}