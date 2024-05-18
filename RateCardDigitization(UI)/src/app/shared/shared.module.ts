import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatListModule} from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { FooterComponent } from './footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ToastermessageComponent } from './toastermessage/toastermessage.component';
import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    ToastermessageComponent,
    HeaderComponent,
    FooterComponent,    
    ConfirmationModalComponent
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSelectModule,
    ToastrModule.forRoot({
      toastComponent: ToastermessageComponent, // added custom toast!
      maxOpened: 1,
      preventDuplicates: true
    })
  ],
  exports:[
    ToastermessageComponent,
    HeaderComponent,
    FooterComponent,
    ConfirmationModalComponent
  ],
  entryComponents:[ToastermessageComponent,ConfirmationModalComponent]
})
export class SharedModule { }
