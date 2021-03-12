import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    public serverHost?: string = "";
    public serverPort?: number = 0
    public streamerSonglistToken?: string = "";

    constructor() {
    }
}