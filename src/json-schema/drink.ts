enum DrinkTypeEnum { Beer, Wine, Liquor, Soft }

export class Drink {
    id: number = 0;
    type: DrinkTypeEnum = DrinkTypeEnum.Beer;
    name: string = "";
    style: string = "";
    brewery: string = "";
    city: string = "";
}