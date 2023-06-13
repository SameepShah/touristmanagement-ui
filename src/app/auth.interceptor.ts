import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const user = this._authService.GetUser;
        const isLoggedIn = user && user.jwtToken;
        if (isLoggedIn) {
          request = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${user.jwtToken}`
              }
          });
      }
      return next.handle(request);
  }
}
