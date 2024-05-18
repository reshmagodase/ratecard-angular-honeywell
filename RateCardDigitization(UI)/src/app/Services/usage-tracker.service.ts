import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject,Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsageTrackerService {
  public configurationData:any;
  
  private feedbackLinkData = new BehaviorSubject('');
  feedbackLink = this.feedbackLinkData.asObservable();
  private helpFileLinkData= new BehaviorSubject('');
  helpFileLink = this.helpFileLinkData.asObservable();
  private legendData = new BehaviorSubject('');
  legend = this.legendData.asObservable();
  constructor(
    private http: HttpClient
  ) { }

  getFeedbackLink(feedbackLinkJSON:string)
  {
    this.feedbackLinkData.next(feedbackLinkJSON);
  }

  getHelpFilelink(helpFileLinkJSON:string)
  {
    this.helpFileLinkData.next(helpFileLinkJSON);
  }

  

  getConfigurationData()
  {
    const requstProcessorData = {
      app: environment.usageApplicationName,
      action: environment.applicationFilesUrl+'/'+environment.applicationName,
      requestType: 'GET'
    };
    return this.http.post<any>(environment.baseUrl + environment.reqProcessorUrl, requstProcessorData)
      .pipe(map(res => res));
  }

  setConfigurationData(configData:any)
  {
    this.configurationData = configData;
  }
    
  downloadFileFromUsageTracker(filename:string): Observable<Blob> {
    const requstProcessorData = {
      app: environment.usageApplicationName,
      action: environment.downloadApplicationFiles + '/'+environment.applicationName+'/' + filename,
      requestType: 'GET',
    };
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.post<any>(environment.baseUrl + environment.fileProcessorURL, requstProcessorData,httpOptions)
      .pipe(map(res => res));
  }
}