import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from 'ag-grid-angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule} from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_RIPPLE_GLOBAL_OPTIONS} from '@angular/material/core';
import { CalendarModule } from 'primeng/calendar';
import {} from 'primeng/calendar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { AddRateCardComponent } from './add-rate-card/add-rate-card.component';
import { RateCardDashboardComponent } from './rate-card-dashboard/rate-card-dashboard.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ApproveDialogComponent } from './approve-dialog/approve-dialog.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { ApproveRejectComponent } from './approve-reject/approve-reject.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/rate-card-dashboard' },
  { path: 'add-rate-card', pathMatch: 'full', component: AddRateCardComponent },    
  { path: 'rate-card-dashboard', pathMatch: 'full', component: RateCardDashboardComponent },    
  { path: 'edit-dialog', pathMatch: 'full', component: EditDialogComponent },    
  { path: 'approve-dialog', pathMatch: 'full', component: ApproveDialogComponent },    
  { path: 'approve-reject', pathMatch: 'full', component: ApproveRejectComponent },    
];

@NgModule({
  declarations: [
    RateCardDashboardComponent,
    AddRateCardComponent,
    EditDialogComponent,
    ApproveDialogComponent,
    AddDialogComponent,
    ApproveRejectComponent,
  ],
  imports: [
    MatCheckboxModule,
    MatChipsModule,
    CommonModule,
    MatInputModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatExpansionModule,
    CalendarModule,
    MatDialogModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    FlexLayoutModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    // ExcelExportModule,
  ],
  exports:[],
  providers: [
    {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: {disabled: true}}
  ]
})
export class RCDModule { }
