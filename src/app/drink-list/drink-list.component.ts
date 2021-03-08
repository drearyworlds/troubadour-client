import { Component, OnInit } from '@angular/core';
import { Drink } from '../../json-schema/drink'
import { DrinkService } from '../drink.service';
import { MessageService } from '../message.service';

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
    private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getDrinkList();
  }

  getDrinkList(): void {
    this.drinkService.getDrinkList()
      .subscribe(drinkList => this.drinks = drinkList.drinks);
  }

  drinkClicked(clickedDrink: Drink): void {
    this.logVerbose(`Clicked a drink: ${clickedDrink.name}`)
    this.drinkService.setCurrentDrink(clickedDrink)
      .subscribe(response => {
        this.logSuccess(`Set current drink to ${clickedDrink.name}`)
        this.success = response.success
      })
  }

  private logFailure(message: string) {
    this.messageService.logFailure(message, this.constructor.name);
  }

  private logSuccess(message: string) {
    this.messageService.logSuccess(message, this.constructor.name);
  }

  private logInfo(message: string) {
    this.messageService.logInfo(message, this.constructor.name);
  }

  private logVerbose(message: string) {
    this.messageService.logVerbose(message, this.constructor.name);
  }
}