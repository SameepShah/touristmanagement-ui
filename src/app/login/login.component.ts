import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { TokenResponse } from '../models/TokenResponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginValid = true;
  public username = '';
  public password = '';

  private _destroySub$ = new Subject<void>();
  private readonly returnUrl: string;

  /**
   * Constructor
   */
  constructor( private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService) {
    
      this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/branches';
  }

  public ngOnInit(): void {
    this._authService.isAuthenticated$.pipe(
      filter((isAuthenticated: TokenResponse) => (isAuthenticated != null && isAuthenticated.jwtToken != undefined)),
      takeUntil(this._destroySub$)
    ).subscribe( _ => this._router.navigateByUrl(this.returnUrl));
  }

  public ngOnDestroy(): void {
    this._destroySub$.next();
  }

  public onSubmit(): void {
    this.loginValid = true;

    this._authService.login(this.username, this.password).pipe(
      take(1)
    ).subscribe({
      next: _ => {
        this.loginValid = true;
        this._router.navigateByUrl('/branches');
      },
      error: _ => this.loginValid = false
    });
  }

}
