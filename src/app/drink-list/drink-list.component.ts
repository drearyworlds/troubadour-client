import { Component, OnInit } from '@angular/core';
import { Drink } from '../../json-schema/drink'
import { DrinkService } from '../drink.service';
import { StatusResponse } from '../../json-schema/statusResponse'
import { LogService } from '../log.service';

@Component({
  selector: 'app-drink-list',
  templateUrl: './drink-list.component.html',
  styleUrls: ['./drink-list.component.css']
})

export class DrinkListComponent implements OnInit {
  drinks?: Drink[]
  success?: boolean
  hideall: boolean = true
  currentDrink?: Drink;

  constructor(
    private drinkService: DrinkService,
    private logService: LogService) {
      this.logService.className = this.constructor.name;
  }

  ngOnInit(): void {
    this.getDrinkList();
  }

  getHeaderRowDivClass() {
    return {
      'rowHeader': true
    }
  }

  getRowDivClass() {
    return {
      'rowActive': true
    }
  }

  getHeaderCellDivClass(fixed: boolean) {
    return {
      'cellHeader': true,
      'cellFixedWidth': fixed
    }
  }

  getCellDivClass(fixed: boolean) {
    return {
      'cellActive': true,
      'cellFixedWidth': fixed
    }
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
    this.drinkService
      .getList()
      .subscribe((drinkList) => {
        this.drinks = drinkList.drinks;
        this.logService.logSuccess('Fetched drink list');
      });
  }

  setAsCurrent(drinkToSet: Drink): void {
    this.logService.logVerbose(`Setting drink as current: ${drinkToSet.name}`);
    this.drinkService
      .setCurrentDrink(drinkToSet)
      .subscribe((response: StatusResponse) => {
        this.success = response.success
        this.logService.logSuccess(`Current song set to: ${drinkToSet.name}`)
      });
  }
}