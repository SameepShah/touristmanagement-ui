import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'touristmanagement-ui';
  public isAuthenticated: boolean = false;

  public logout(): void{
    //TODO: Logout Functionality
    alert("TODO: Logout Functionality");
  }
}
