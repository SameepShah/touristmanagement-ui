import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { TokenResponse } from '../models/TokenResponse';
import { UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _authSub$: BehaviorSubject<TokenResponse>;
  private userRole: string = '';
  constructor(private _router: Router, public http: HttpClient) { 
    this._authSub$ =  new BehaviorSubject<TokenResponse>(JSON.parse(localStorage.getItem('user')));
  }

  //private _authSub$: BehaviorSubject<TokenResponse> = new BehaviorSubject<TokenResponse>(null);
  public get isAuthenticated$(): Observable<TokenResponse> {
    return this._authSub$.asObservable();
  }

  public ngOnDestroy(): void {
    this._authSub$.next(null);
    this._authSub$.complete();
  }

  /**
   * Login Service Call
   * @param username 
   * @param password 
   * @returns 
   */
  public login(username: string, password: string): Observable<void> {
    return from(this.signInWithCredentials(username, password)).pipe(
      map((t: TokenResponse) => this.handleSignInResponse(t))
    );
  }

  /**
   * SignIn With Credential
   * @param username 
   * @param password 
   */
  private signInWithCredentials(username: string, password: string): Observable<any>
  {
    var requestData = {
      UserName: username,
      Password: password
    };
    const url = environment.accountApiUri + 'authenticate';
    return this.http.post(url,requestData,{
      headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'}
    });
  }
  public GetRole(){
    return this.userRole;
  }

  /**
   * Logout Functionality
   */
  public logout(redirect: string): void{
    this._authSub$.next(null);
    localStorage.removeItem('user');
    this._router.navigate([redirect]);
  }

  /**
   * Handle Signin Response
   * @param transaction 
   */
  private handleSignInResponse(response: TokenResponse): void {
    if (response.jwtToken == undefined || response.jwtToken == '') {
      throw new Error('Unauthorized');
    }
    this.userRole = response.role;
    localStorage.setItem('user', JSON.stringify(response));
    this._authSub$.next(response);
    //Set Session Storage or Header for each request with Bearer Token
    //this._authClient.session.setCookieAndRedirect(transaction.sessionToken);
  }

  public get GetUser(): TokenResponse {
    return this._authSub$.value;
  }


}
