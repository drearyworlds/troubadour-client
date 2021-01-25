enum DrinkTypeEnum { Beer, Wine, Liquor, Soft }

export interface Drink {
    id?: number;
    type: DrinkTypeEnum
    name: string;
    style: string;
    brewery: string;
    city: number;
}