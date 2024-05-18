import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, ColumnApi, GridOptions } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { ToastermessageComponent } from 'src/app/shared/toastermessage/toastermessage.component';
import { ApiService } from 'src/app/Services/api-service';
import { RcdService } from 'src/app/Services/rcd-service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { UsageTrackerService } from 'src/app/Services/usage-tracker.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-rate-card',
  templateUrl: './add-rate-card.component.html',
  styleUrls: ['./add-rate-card.component.css']
})
export class AddRateCardComponent {
  rowData: any[] = [];
  gridOptions: GridOptions = {};
  columnDefs: ColDef[] = [];
  selectedColumns = [];
  defaultColDef: any;
  gridApi: any;
  gridColumnApi: any;
  allColumns: any = [];
  groupList: any = [];
  userRole: any=[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService, 
    private spinner: NgxSpinnerService,
    public usageTrackerService: UsageTrackerService,
    public apiService: ApiService,
    public rcdService: RcdService,
  ) {

    this.userRole = this.apiService.userDetails.listOfRoleName.indexOf('RateCardAdmin') > -1;

    this.columnDefs = [
      {
        headerName: 'Rate Card Id',
        field: 'RateCardId',
        sortable: false,
        filter: true,
        width: 50,
        headerTooltip: 'RateCard ID',
      },
      {
        headerName: 'Vendor Name',
        field: 'Vendor',
        sortable: false,
        filter: true,
        width:100,
        headerTooltip: 'Vendor Name',
      },
      { headerName: 'Work Package', field: 'WorkPackage', sortable: false, filter: true },
      {
        headerName: ' Current INR Rate',
        field: 'INRRate',
        sortable: false,
        filter: true,
        width:100
      },
      {
        headerName: 'Current USD Rate',
        field: 'USDRate',
        sortable: false,
        filter: true,
        width:100
      }
      ,
      {
        headerName: 'Account Indicator',
        field: 'AccountIndicator',
        sortable: false,
        filter: true,
        width:100
      },
      { headerName: 'Group', field: 'GroupName', sortable: false, filter: true, width:150 },
      {
        headerName: 'Proposed New INR Rate',
        field: 'ProposedNewINRRate',
        sortable: false,
        filter: true,
        width: 100,
        headerTooltip: 'Proposed New INR Rate',
      },
      {
        headerName: 'Proposed New USD Rate',
        field: 'ProposedNewUSDRate',
        sortable: false,
        filter: true,
        width: 100,
        headerTooltip: 'Proposed New USD Rate',
      },
      {
        headerName: 'Proposed New WorkPackage',
        field: 'ProposedNewworkPackageName',
        sortable: false,
        filter: true,
        width: 100,
        headerTooltip: 'Proposed New WorkPackage',
      },
      // {
      //   headerName: 'Status',
      //   field: 'status',
      //   sortable: false,
      //   filter: true,
      //   width: 100,
      //   // hide: !this.isUserAuthorizedForColumns(),
      // },
      {
        headerName: 'Actions',
        cellRenderer: 'actionRenderer',
        cellRendererParams: {
          onEditClick: this.editDashboardItem.bind(this),
          onDeleteClick: this.deleteDashboardItem.bind(this),
          // onApproveClick: this.approveDashboardItem.bind(this),
          userRole: this.userRole,
        },
        width: 150,
        sortable: false,
        filter: false,
        cellStyle: { textAlign: 'center' },
      },      

    ];

    this.selectedColumns = this.allColumns.map((x: { value: any }) => x.value);
    this.getAllGroup();

    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: false,
      filter: false,
      floatingFilter: false,
    };

    this.gridOptions = {
      defaultColDef: this.defaultColDef,
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      frameworkComponents: {
        actionRenderer: ActionRendererComponent,
        // approveRenderer: ApproveRendererComponent,
      },
      pagination: true,
      paginationPageSize: 10,
    };
  }

  getAllGroup() {
    this.rcdService.getMasterData().subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.groupList = [];
          if (res.data.table.length > 0) {
            for (var item of res.data.table)
              this.groupList.push({
                label: item.groupName,
                value: item.groupName,
                id: item.groupId,
              });
          }
          // this.fetchDataFromApi();
        }
      },
      (err) => {
        this.toastr.error('Something went wrong', 'Error', {
          toastComponent: ToastermessageComponent,
        });
      }
    );
  }

  ngOnInit() {
    // this.fetchDataFromApi();
  }

  onFirstDataRendered(params: any) {
    console.log('hi');
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();

    if (this.gridApi) {
      this.gridApi.setFilterModel(null);
    }
  }

  addrc() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '800px',
      data: {},
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rowData.push(result);
        //console.log('Updated rowData:', this.rowData);
  
        this.gridOptions.api?.setRowData(this.rowData);
        //this.gridOptions.api?.hideOverlay();
        //console.log('Grid data updated with new entry');
      }
    });
  }
  
  onSubmit() {

    const requestData = this.rowData;
    //console.log(JSON.stringify(requestData));
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
    data:{
      message: 'Do you want to Submit?',
      actionButton: 'Yes'
    },      
    maxWidth: '100vw',
    maxHeight: '100vh',
    //height: '23%',
    width: '30%',
    panelClass: ['full-screen-modal', 'no-scrollbar']
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.spinner.show();
        this.rcdService.saveRateCardDetails(requestData).subscribe(
          (response: any) => {
            console.log('Data saved successfully:', response);            
            this.spinner.hide();
            this.toastr.success('Data Submitted Successfully', 'Done', {
              toastComponent: ToastermessageComponent,
            });
            this.rowData =[];
            this.gridOptions.api?.setRowData([]);
          },
          (error: any) => {
            console.error('Error saving data:', error);
          }
        );
      } else {
        this.spinner.hide();
        this.toastr.error('Please check data..Error while submitting', 'Error', {
          toastComponent: ToastermessageComponent,
        });
      }
    });
  }

  Update() {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data:{},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      // this.fetchDataFromApi();
      this.rowData.push(result);
        console.log('Updated rowData:', this.rowData);
  
        this.gridOptions.api?.setRowData(this.rowData);
        console.log('Grid data updated with new entry');
      }
    });
  }
  
  editDashboardItem(gridItem: any) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        gridItem:gridItem
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.gridOptions.api?.setRowData(this.rowData);
      }
    });
  }

  deleteDashboardItem(gridItem: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
    data:{
      message: 'Do you want to Submit?',
      actionButton: 'Yes'
    },      
    maxWidth: '100vw',
    maxHeight: '100vh',
    //height: '23%',
    width: '30%',
    panelClass: ['full-screen-modal', 'no-scrollbar']
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //this.rowData.filter()
        this.gridOptions.api?.applyTransaction({ remove: [ gridItem] })
      }
    });
  }
}

@Component({
  selector: 'app-action-renderer',
  template: `
    <div class="action-cell">
      <i class="material-icons edit-icon" 
      (click)="onEditClick()"
      [hidden]="isDisabled()">edit</i>
      <i class="material-icons delete-icon" 
      (click)="onDeleteClick()"
      [hidden]="isDisabled()">delete</i>
    </div>
  `,
  styles: [`
    .action-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .delete-icon{
      cursor: pointer;
      margin: 0 4px;
      color:red;
    }
    .edit-icon {
      cursor: pointer;
      margin: 0 4px;
    }

    .edit-icon {
      color: blue;
    }

    .action-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .approve-icon {
      color: green;
      font-size: 24px;
      cursor: pointer;
    }

    .disabled {
      color: gray; /* Or any other color to indicate disabled */
      cursor: not-allowed;
    }
  `]
})
export class ActionRendererComponent {
  params: any;
  status: string;

  constructor() {
    this.status = ''; // Initialize with an appropriate default value
  }

  agInit(params: any): void {
    this.params = params;
    this.status = params.node.data.status;
  }

  isDisabled(): boolean {
    // Check if RateCardId is null or empty
    const rateCardId = this.params.node.data.RateCardId;
    return !rateCardId || rateCardId === null;
  }

  onEditClick() {
    console.log('Edit button clicked.');
    if (!this.isDisabled()) {
      const { onEditClick, node } = this.params;
      if (onEditClick && node) {
        const item = node.data;
        onEditClick(item);
      }
    }
  }

  onDeleteClick() {
    console.log('Delete button clicked.');
    if (!this.isDisabled()) {
      const { onDeleteClick, node } = this.params;
      if (onDeleteClick && node) {
        const item = node.data;
        onDeleteClick(item);
      }
    }
  }

}
