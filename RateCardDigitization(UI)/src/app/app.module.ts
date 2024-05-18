import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import { HttpClientModule} from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { ApiService } from './Services/api-service';
import { UsageTrackerService } from './Services/usage-tracker.service';
import { RcdService } from './Services/rcd-service';
import {RCDModule} from './RCD/RCD.module'
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatMenuModule,
    MatDialogModule,
    MatListModule,
    MatSidenavModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({timeOut: 10000,preventDuplicates:true}),
    RCDModule,
    AgGridModule,
    MdbCollapseModule,
  ],
  providers: [UsageTrackerService,ApiService,
  RcdService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
