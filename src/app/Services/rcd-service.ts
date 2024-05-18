import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class RcdService {
    options: any;
    cookieValue: any;
    userId: any;
    usageTrackerService: any;

    getUserId() {
        return this.userId;
    }
    setUserId(eid: any) {
        this.userId = eid;
    }

    constructor(private http: HttpClient,
        private cookieService: CookieService) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        this.options = { headers };
        this.cookieValue = this.cookieService.get('userEID');
    }

    getRateCardDetails() {
        const requstProcessorData = {
            app: environment.applicationName,
            action: environment.getRateCardDetails,
            requestType: 'GET'
        };
        return this.http.post(environment.baseUrl + environment.reqProcessorUrl, requstProcessorData,
            this.options).pipe(map(response => response));
    }

    getRateCardDetailsbyId(RateCardId: any) {
        const requstProcessorData = {
            app: environment.applicationName,
            action: environment.getRateCardDetailsbyId + `?RateCardId=` + RateCardId,
            requestType: 'GET'
        };
        return this.http.post(environment.baseUrl + environment.reqProcessorUrl, requstProcessorData,
            this.options).pipe(map(response => response));
    }

    getRateCardDetailsbyStatus(Status: any) {
        const requstProcessorData = {
            app: environment.applicationName,
            action: environment.getRateCardDetailsbyStatus + `?Status=` +Status,
            requestType: 'GET'
        };
        return this.http.post(environment.baseUrl + environment.reqProcessorUrl, requstProcessorData,
            this.options).pipe(map(response => response));
    }

    getMasterData() {
        const requstProcessorData = {
            app: environment.applicationName,
            action: environment.getMasterData,
            requestType: 'GET'
        };
        return this.http.post(environment.baseUrl + environment.reqProcessorUrl, requstProcessorData,
            this.options).pipe(map(response => response));
    }

    saveRateCardDetails(data: any) {
        const requestData = {
          app: environment.applicationName,
          action: environment.AddUpdateRateCardDetails,
          data: JSON.stringify(data),
          requestType: 'POST'
        };
        // const userId = 'H121149'; 
      
        return this.http
          .post(environment.baseUrl + environment.reqProcessorUrl + `?userEID=${this.userId}`, requestData, this.options)
          .pipe(map(response => response));
      }

      updateRateCardData(RataCardData: any) {
            const requstProcessorData = {
                app: environment.applicationName,
                action: environment.updateRateCardData,
                data: JSON.stringify(RataCardData),
                requestType: "POST"
            };
            // const userId = 'H121149'; 
            return this.http.post<any>(environment.baseUrl + environment.reqProcessorUrl + `?userEID=${this.userId}` , requstProcessorData)
                .pipe(map(res => res));
        }

      ApproveRejectRateCardData(RataCardData: any) {
            const requstProcessorData = {
                app: environment.applicationName,
                action: environment.ApproveRejectRateCardData,
                data: JSON.stringify(RataCardData),
                requestType: "POST"
            };
            // const userId = 'H121149'; 
            return this.http.post<any>(environment.baseUrl + environment.reqProcessorUrl, requstProcessorData)
                .pipe(map(res => res));
        }

    
      
}
      
      
