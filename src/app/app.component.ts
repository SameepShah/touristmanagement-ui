import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'touristmanagement-ui';
  public isAuthenticated: boolean = false;
  private _destroySub$ = new Subject<void>();
  /**
   * Constructor
   */
  constructor(private _authService: AuthService) {
  }

  public ngOnInit(): void {
    this._authService.isAuthenticated$.pipe(
      takeUntil(this._destroySub$)
    ).subscribe((isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated);
  }

  public ngOnDestroy(): void {
    this._destroySub$.next();
  }

  public logout(): void{
    //TODO: Logout Functionality
    this._authService.logout('/login');
    alert("TODO: Logout Functionality");
  }


}
