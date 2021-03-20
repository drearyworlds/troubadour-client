import { SsSong } from './ss-objects'

export class Song extends SsSong {
    id: number = 0;
    tuning: string = "Standard";
    pick: boolean = true;
    composer : string = "";
    suggestedBy: string = "drearyworlds";
}