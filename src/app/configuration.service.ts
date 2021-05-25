import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    // Note: These values are not currently being read from the config.json
    public serverHost: string = "localhost";
    public serverPort: number = 3000;

    constructor() {
    }

    public setValuesFrom(copy: ConfigurationService) {
        this.serverHost = copy.getServerHost();
        this.serverPort = copy.getServerPort();
    }

    public getServerHost(): string {
        return this.serverHost;
    }

    public getServerPort(): number {
        return this.serverPort;
    }
}