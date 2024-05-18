import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastermessageComponent } from './shared/toastermessage/toastermessage.component';
import * as _ from 'lodash';
import { RcdService } from './Services/rcd-service';
import { ApiService } from './Services/api-service';
import { UsageTrackerService } from './Services/usage-tracker.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  message: string='';
  userInitial: string='';
  headerName: any = '';
  userName: string='';
  businessTitle: string='';
  isIEOrEdge: boolean = false;
  feedbackLink: string = '';
  helpFileName: any;
  title:any='';
  uiParamsLoaded = false;

  @ViewChild('menuBtn1', { read: MatMenuTrigger, static: false })
  menu1!: MatMenuTrigger;
  userId: string;
  version: any;
  defectLink: any;
  clientHeight: number;
  activeLink:any;
  // sessionTimeoutInterval: number;
  interval: any;
  // timeLeft: number;
  // activeLink = 'CO-UPSELL';

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private dialog: MatDialog,
    public rcdService: RcdService,
    private usageTrackerService: UsageTrackerService,
    public service:ApiService,
    private router: Router,   
  ) { 
    this.isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent); 
    this.userId = "@userId";
    this.title=environment.applicationTitle;
    this.clientHeight = window.innerHeight; 
    router.events.subscribe((val) => {
      this.activeLink = router.url;
      console.log(router.url);
    
  });
  }

  ngOnInit(): void {
    this.headerName = environment.applicationTitle;  
    this.getUserDetails(this.userId);
  }

  getUserDetails(userId:string) {
    this.spinner.show();
    this.service.getUserDetails(userId).subscribe(res => {      
      if ((res.Status === 403 || res.Status === 401) && res.data === 'unauthorized access') {
        this.toastr.error('You are not authorised to access this application', 'Error',{toastComponent:ToastermessageComponent});
        setTimeout(() => {
          // window.location.href = res.URL;
        }, 3000);
      } else {
        if (res.UserApplicationList.indexOf(environment.applicationName)>-1) {
          this.userInitial = (res.employee.nameFirst).charAt(0) + (res.employee.nameLast).charAt(0);
          this.userName = res.employee.nameFirst + ' ' + res.employee.nameLast;
          this.businessTitle = res.employee.businessTitle;
          this.rcdService.setUserId(res.employee.eid);

          if(res.listOfRoleName.filter((p:any) => p.includes('RateCardAdmin')).length > 0)
              this.service.setUserRole('RateCardAdmin');
          else if(res.listOfRoleName.filter((p:any) => p.includes('RateCardCommercial')).length > 0)
              this.service.setUserRole('RateCardCommercial');
          else if(res.listOfRoleName.filter((p:any) => p.includes('RateCardSupplier')).length > 0)
              this.service.setUserRole('RateCardSupplier');
          else 
              this.service.setUserRole('RateCardBuyer');
          //if(res.listOfRoleName.indexOf('RateCardAdmin') > -1) this.service.setUserRole('RateCardAdmin'); else this.service.setUserRole('RateCardUser')
          this.getConfigurationData(); 
          this.service.userDetails = res;    
          //session timeout started
          // this.sessionService.getSessionTimeoutValue();     
          this.spinner.hide();    
        } else {
          this.toastr.error('You are not authorised to access this application', 'Error',{toastComponent:ToastermessageComponent});
          setTimeout(() => {
            // window.location.href = res.redirectUrl;
          }, 3000);          
        }
      }
    }, err => {
      this.spinner.hide();
      // this.errorHandlingService.handleErrorMessages(err);
    });
  }

  getConfigurationData()
  {
    this.usageTrackerService.getConfigurationData().subscribe((data: any)=>{
      this.usageTrackerService.setConfigurationData(data);
      this.version =JSON.parse(data.fileData.version)[0].version;
      this.feedbackLink = JSON.parse(data.fileData['feedback-link'])[0].link;
      this.defectLink = JSON.parse(data.fileData['feedback-link'])[1].link;
      this.helpFileName = data.downloadableFileNames.help;
      //this.service.UIParams = JSON.parse(data.fileData['UIParams'])[0];
      this.uiParamsLoaded = true;
      this.spinner.hide();
    },(err:any)=>{
      this.spinner.hide();
      // this.errorHandlingService.handleErrorMessages(err);
    });
  }

  openFeedbackForm() {
    window.open(this.feedbackLink, "_blank");
  }
  
  openDefectLink() {
    window.open(this.defectLink, "_blank");
  }

  openMyMenu() {
    this.menu1.toggleMenu();
  }

  closeMyMenu() {
    this.menu1.closeMenu();
  }

  downloadHelpFile() {
    if (this.helpFileName != null && this.helpFileName != "" && this.helpFileName != undefined) {
      this.usageTrackerService.downloadFileFromUsageTracker(this.helpFileName).subscribe(data => {
        if (this.isIEOrEdge == true) {
          var blob = new Blob([data], { type: 'application/pdf' });
          // window.navigator.msSaveBlob(blob, this.helpFileName);
        }
        else {
          var blob = new Blob([data], { type: 'application/pdf' });
          const urlCreator = window.URL;
          const url = urlCreator.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = "help.pdf";
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        }
      }, err => {
        this.spinner.hide();
        // this.errorHandlingService.handleErrorMessages(err);
      });
    }
  }

  logOut(){
    this.spinner.show();
    this.service.logout().subscribe(res => {
      this.spinner.hide();
      if (res.status === 200) {
        window.location.href = res.URL;
      } else {
        this.toastr.error(res.data, 'Error',{toastComponent:ToastermessageComponent});
      }
    }, err => {
      this.spinner.hide();
      // this.errorHandlingService.handleErrorMessages(err);
    });
  }

  currentPage: string = '/rate-card-dashboard';
  
  selectPage(page: string) : void  {
    switch (page) {
      case 'create-rc':
        this.router.navigate(['/add-rate-card']);
        break;
      case 'rc-dashboard':
        this.router.navigate(['/rate-card-dashboard']);
        break;
      case 'approve':
         this.router.navigate(['/approve-reject']);
         break;
      case 'approve':
        this.router.navigate(['/approve-reject']);
        break;
      default:
        // Handle invalid page selection or add custom logic
        break;
    }
  }

}
