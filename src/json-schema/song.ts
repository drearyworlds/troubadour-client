import { SsSong } from './ss-objects'

export interface Song extends SsSong {
    id: number;
    tuning: string;
    pick: boolean;
    composer : string;
    suggestedBy: string;
}