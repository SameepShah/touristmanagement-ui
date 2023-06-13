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
  
  constructor(private _router: Router, public http: HttpClient) { }

  private _authSub$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get isAuthenticated$(): Observable<boolean> {
    return this._authSub$.asObservable();
  }

  public ngOnDestroy(): void {
    this._authSub$.next(false);
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

  /**
   * Logout Functionality
   */
  public logout(redirect: string): void{
    this._authSub$.next(false);
    this._router.navigate([redirect]);
  }

  // /**
  //  * Logout Service Call
  //  * @param redirect 
  //  * @returns 
  //  */
  // public logout(redirect: string): Observable<void> {
  //   return from(this._authClient.signOut()).pipe(
  //     tap( _ => (this._authSub$.next(false), this._router.navigate([redirect]))),
  //     catchError(err => {
  //       console.error(err);
  //       throw new Error('Unable to sign out');
  //     })
  //   )
  // }

  /**
   * Handle Signin Response
   * @param transaction 
   */
  private handleSignInResponse(response: TokenResponse): void {
    if (response.JwtToken == undefined || response.JwtToken == '') {
      throw new Error('Unauthorized');
    }

    this._authSub$.next(true);
    //Set Session Storage or Header for each request with Bearer Token
    //this._authClient.session.setCookieAndRedirect(transaction.sessionToken);
  }


}
