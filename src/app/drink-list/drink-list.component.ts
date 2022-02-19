import { Component, OnInit } from '@angular/core';
import { Drink } from '../../json-schema/drink'
import { DrinkService } from '../drink.service';
import { StatusResponse } from '../../json-schema/statusResponse'
import { LogService, LogLevel } from '../log.service';
import { LocalStorageService } from '../local-storage.service'

enum SortBy {
  BREWERY = "brewery",
  NAME = "name",
  STYLE = "style",
  CITY = "city"
};

enum SortDirection {
  ASC = "ASC",
  DESC = "DESC"
};

@Component({
  selector: 'app-drink-list',
  templateUrl: './drink-list.component.html',
  styleUrls: ['./drink-list.component.css']
})

export class DrinkListComponent implements OnInit {
  // Make a variable reference to our Enum
  eSortBy = SortBy;
  eSortDirection = SortDirection;

  drinks: Drink[] = []
  sortedBy: SortBy = SortBy.BREWERY;
  sortedDirection: SortDirection = SortDirection.ASC;

  success?: boolean
  hideall: boolean = true
  currentDrink?: Drink;

  constructor(
    private drinkService: DrinkService,
    private logService: LogService,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    const methodName = this.ngOnInit.name;
    this.getDrinkList();
  }

  isEditMode(): boolean {
    return this.localStorageService.isEditMode();
  }

  sortByBreweryNameStyleCity() {
    const methodName = this.sortByBreweryNameStyleCity.name;

    this.log(LogLevel.Verbose, `sorting by Brewery/Name/Style/City`, methodName)

    this.sortedDirection = SortDirection.ASC;
    this.sortByAll(new Array(SortBy.CITY, SortBy.STYLE, SortBy.NAME, SortBy.BREWERY));
  }

  sortByAll(sortBy: Array<SortBy>) {
    const methodName = this.sortByAll.name;

    for (let i = 0; i < sortBy.length; i++) {
      this.sortBy(sortBy[i])
    }

    this.log(LogLevel.Info, `Sorted by ${sortBy}, direction: ${this.sortedDirection}`, methodName)
  }

  sortBy(sortBy: SortBy) {
    const methodName = this.sortBy.name;

    // If we are already sorted by this column, just change sort direction
    if (sortBy == this.sortedBy) {
      this.sortedDirection = (this.sortedDirection == SortDirection.ASC) ? SortDirection.DESC : SortDirection.ASC;
      this.log(LogLevel.Info, `already sorted by ${this.sortedBy}, changing direction to: ${this.sortedDirection}`, methodName)
    }

    this.sortedBy = sortBy
    this.log(LogLevel.Verbose, `sorting by ${this.sortedBy}, direction: ${this.sortedDirection}`, methodName)

    this.sort();
  }

  private getSortValueString(sortField: string, sortValue: string) {
    const THE_PREFIX = "The ";

    try {
      if (sortField == undefined) {
        console.log(`sortField was undefined`)
      }
      if (sortValue == undefined) {
        console.log(`sortValue was undefined`)
      }

      if (sortField.startsWith("date")) {
        //console.log(`sortField "${sortField}" starts with "date"`)
        sortValue = this.formatDate(new Date(sortValue));
      }

      if (sortField == "active") {
        //console.log(`sortField "${sortField}" is "active"`)
        sortValue = (sortValue ? "0" : "1");
      }

      if ((sortField == "artist" || sortField == "title") && sortValue.startsWith(THE_PREFIX)) {
        //console.log(`sortValue "${sortValue}" starts with "${THE_PREFIX}"`)
        sortValue = sortValue.substr(THE_PREFIX.length);
      }
    } catch (ex) {
      console.log(`exception: ${ex} with value ${sortValue}`);
      console.log(`sortField: ${sortField}`);
      console.log(`sortValue: ${sortValue}`);
    }

    return sortValue;
  }

  private sort() {
    let sortField = this.sortedBy as keyof Drink

    console.log(`Sorting by ${sortField}`)

    this.drinks.sort((d1, d2,) => {
      let s1ValueToSort = this.getSortValueString(sortField, d1[sortField] as string);
      let s2ValueToSort = this.getSortValueString(sortField, d2[sortField] as string);

      return  (this.sortedDirection == SortDirection.ASC) ?
          (s1ValueToSort <= s2ValueToSort ? -1 : 1)
          : (s1ValueToSort >= s2ValueToSort ? -1 : 1)
    });
  }

  formatDate(dateToFormat: Date): string {
    function pad(numberToPad: number) {
      if (numberToPad < 10) {
        return "0" + numberToPad;
      } else {
        return `${numberToPad}`;
      }
    }

    dateToFormat = new Date(dateToFormat);
    return `${dateToFormat.getFullYear()}.${pad(dateToFormat.getMonth() + 1)}.${pad(dateToFormat.getDate())}`;
  }

  getNextValidSongId(): number {
    let returnValue = 0

    if (this.drinks) {
      for (let drink of this.drinks) {
        if (drink.id > returnValue) {
          returnValue = drink.id;
        }
      }
    }

    return returnValue;
  }

  getDrinkList(): void {
    const methodName = this.getDrinkList.name;

    this.drinkService
      .getList()
      .subscribe((drinkList) => {
        this.drinks = drinkList.drinks;
        this.sortByBreweryNameStyleCity();
        this.log(LogLevel.Success, 'Fetched drink list', methodName);
      });
  }

  setAsCurrent(drinkToSet: Drink): void {
    const methodName = this.setAsCurrent.name;
    this.log(LogLevel.Verbose, `Setting drink as current: ${drinkToSet.name}`, methodName);
    this.drinkService
      .setCurrentDrink(drinkToSet)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.log(LogLevel.Success, `Current song set to: ${drinkToSet.name}`, methodName)
      });
  }

  log(logLevel: LogLevel, message: string, methodName: string) {
    this.logService.log(logLevel, message, this.constructor.name, methodName)
  }
}