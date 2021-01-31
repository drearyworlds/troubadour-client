import { Component, OnInit } from '@angular/core';
import { Drink } from '../../json-schema/drink'
import { StatusResponse } from '../../json-schema/statusResponse'
import { DrinkService } from '../drink.service';
import { MessageService } from '../message.service';
import { isSuccess } from 'angular-in-memory-web-api';

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
    this.messageService.add(`Clicked a drink: ${clickedDrink.name}`)
    this.drinkService.setCurrentDrink(clickedDrink)
      .subscribe(response => this.success = response.success)

      //TODO: Figure out why success doesn't return true
    // this.messageService.add(`Success: ${this.success}`)
  }
}