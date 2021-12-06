import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, mapTo } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'token';
  private readonly REFRESH_TOKEN = 'refreshtoken';
  private loggedUser: string;

  constructor(private router: Router, private http: HttpClient, private asas: ToastrService, private actRoute: ActivatedRoute) {
    this.checkUserLoggedIn();
  }
  checkUserLoggedIn() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      var decoded = jwt_decode(token);
      if (new Date(decoded['exp']) > new Date()) {
        let continue_url = window.location.href;
        this.router.navigate(['/login'], { queryParams: { continue_url: continue_url } });
      }
    }
  }

  diff_minutes(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));

  }

  login(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<any>(environment.apiUrl + 'authenticate/generate-token', user)
      .pipe(
        tap(tokens => {
          console.log(tokens);
          if (tokens.message == 'success')
            this.doLoginUser(user.username, tokens);
          else if (tokens.message)
            alert(tokens.message);
          else
            alert("Login Failed.!!");
        }),
        mapTo(true));
  }

  googleLogin(request): Observable<boolean> {
    return this.http.post<any>(environment.apiUrl + 'authenticate/generate-token-google', request)
      .pipe(
        tap(tokens => {
          console.log(tokens);
          if (tokens.message == 'success')
            this.doLoginUser(request.googleEmailId, tokens);
          else if (tokens.message)
            alert(tokens.message);
          else
            alert('Login Failed')
        }),
        mapTo(true));
  }

  logout() {
    // return this.http.post<any>(this.url+`${config.apiUrl}/logout`, {
    //   'refreshToken': this.getRefreshToken()
    // }).pipe(
    //   tap(() => this.doLogoutUser()),
    //   mapTo(true),
    //   catchError(error => {
    //     alert(error.error);
    //     return of(false);
    //   }));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http.post<any>(environment.apiUrl + 'authenticate/refresh-token', {
      'refreshtoken': this.getRefreshToken()
    }).pipe(tap((tokens: any) => {
      console.log(tokens);
      this.storeJwtToken(tokens.token);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(username: string, tokens: any) {
    this.loggedUser = username;
    this.storeTokens(tokens);
    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['continue_url'])
        window.location.href = params['continue_url'];
      else
        window.location.href = "./";
    })

  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: any) {
    localStorage.setItem(this.JWT_TOKEN, tokens.token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshtoken);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  public getAuthPayload() {

    if (localStorage.getItem('token')) {
      console.log(localStorage.getItem('token'));
      const token = localStorage.getItem('token');
      var decoded = jwt_decode(token);
      console.log(decoded);
      console.log(new Date(1597152005) > new Date());
    } else {
      window.location.href = '/login';
    }
  }

  public getLoginEmailId() {
    // console.log(localStorage.getItem('token'));
    const token = localStorage.getItem('token');
    var decoded = jwt_decode(token);
    console.log(decoded);
    return decoded['sub'];

  }

  public getInstituteDetails() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      var decoded = jwt_decode(token);
      var InstituteDetails = decoded['InstituteDetails'];
      return InstituteDetails;
    } else {
      return null;
    }
  }

  public getInstituteContactDetails() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      var decoded = jwt_decode(token);
      var InstituteDetails = decoded['InstituteContactDetails'];
      return InstituteDetails;
    } else {
      return null;
    }
  }
}