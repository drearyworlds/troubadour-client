import { Component } from '@angular/core';
import { ConfigurationService } from './configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Current Song';
  
  constructor(private configurationService : ConfigurationService) {

  }

  isEditMode(): boolean {
    return this.configurationService.isEditMode();
  }
}
