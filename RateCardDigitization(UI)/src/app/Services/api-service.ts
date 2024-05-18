import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  options: any;
  cookieValue: any;
  userDetails:any;
  UIParams:any;
  public userRole:any;

  getUserRole() {
    return this.userRole;
  }
  setUserRole(listOfRoleName: any) {
    this.userRole = listOfRoleName;
  }

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    this.options = { headers };
    this.cookieValue = this.cookieService.get('userEID');
  }

  getUserDetails(userId:string): Observable<any> {
    const requstProcessorData = {
      app: environment.securityName,
      action: '/api/Employee/' + userId,
      requestType: 'GET'
    };
    return this.http.post(environment.baseUrl + environment.reqProcessorUrl, requstProcessorData,
      this.options).pipe(map(response => response));
  }

  getSessionTimeoutValue()
  {
    return this.http.get(environment.baseUrl + environment.sessionTimeoutURL, this.options)
    .pipe(map(res => res));
  }

  logout(): Observable<any> {
    const requstProcessorData = {
      app: environment.securityName,
      action: '/api/UserSession/logout',
      requestType: 'GET'
    };
    return this.http.post(environment.baseUrl + environment.reqProcessorUrl, requstProcessorData, this.options)
    .pipe(map(res => res));
  }

}