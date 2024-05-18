import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Environment } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ToastermessageComponent } from '../toastermessage/toastermessage.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  message: string='';
  userInitial: string='';
  headerName: any = '';
  userName: string='';
  businessTitle: string='';
  isIEOrEdge: boolean = false;
  feedbackLink: string = '';
  helpFileName: any;
  title:any='';
  
  
  @ViewChild('menuBtn1', { read: MatMenuTrigger, static: false })
  menu1!: MatMenuTrigger;
  userId: string;
  version: any;
  defectLink: any;
  
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) { 
    this.isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent); 
    this.userId = "@userId";
    this.title=environment.applicationTitle;
  }
  
  ngOnInit(): void {
    this.headerName = environment.applicationTitle;  
  }

  openFeedbackForm() {
    window.open(this.feedbackLink, "_blank");
  }

  openDefectLink() {
    window.open(this.defectLink, "_blank");
  }

  downloadHelpFile(){

  }

  openMyMenu() {
    this.menu1.toggleMenu();
  }

  closeMyMenu() {
    this.menu1.closeMenu();
  }

  logOut(){
    
  }


}

