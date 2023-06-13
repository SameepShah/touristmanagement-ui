import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, Observable } from 'rxjs';
import { TokenResponse } from './models/TokenResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this._authService.isAuthenticated$
      .pipe(
        map((s: TokenResponse) => (s != null && s.jwtToken != undefined) ? true: this._router.parseUrl('/login'))
      );
  }
}
