import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, ColumnApi, GridOptions } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/Services/api-service';
import { RcdService } from 'src/app/Services/rcd-service';
import { UsageTrackerService } from 'src/app/Services/usage-tracker.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ToastermessageComponent } from 'src/app/shared/toastermessage/toastermessage.component';

@Component({
  selector: 'app-approve-reject',
  templateUrl: './approve-reject.component.html',
  styleUrls: ['./approve-reject.component.css']
})
export class ApproveRejectComponent {
  rowData: any[] = [];
  gridOptions: GridOptions = {};
  columnDefs: ColDef[] = [];
  selectedColumns = [];
  defaultColDef: any;
  gridApi: any;
  gridColumnApi: any;
  allColumns: any = [];
  groupList: any = [];
  //userRoleList: any=[];
  userRole: any=[];

  formData = {
    comment: '',
    commentRequired: false,
  }

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

    this.userRole = this.apiService.getUserRole();
    //this.apiService.userDetails.listOfRoleName.indexOf('RateCardSupplier');
    //this.userRole = 'RateCardSupplier';

    this.columnDefs = [
      {
        headerName: 'Rate Card Id',
        field: 'RateCardId',
        sortable: false,
        filter: true,
        width: 50,
      },
      {
        headerName: 'Vendor',
        field: 'Vendor',
        sortable: false,
        filter: true,
        width:100
      },
      { headerName: 'Work Package', field: 'WorkPackage', sortable: false, filter: true },
      {
        headerName: ' Current INR Rate',
        field: 'InrRate',
        sortable: false,
        filter: true,
        width:100,
        //hide: (this.userRole === 'RateCardSupplier' ? false : this.userRole === 'RateCardAdmin'? false : true),
      },
      {
        headerName: 'Current USD Rate',
        field: 'UsdRate',
        sortable: false,
        filter: true,
        width:100,
        //hide: (this.userRole === 'RateCardCommercial' ? false : this.userRole === 'RateCardAdmin'? false : true)
        //!this.isUserAuthorizedForColumns(),
      },
      { headerName: 'Group', field: 'Group', sortable: false, filter: true, width:150 },
      {
        headerName: 'Proposed New INR Rate',
        field: 'ProposedNewINRRate',
        sortable: false,
        filter: true,
        width: 100,
        headerTooltip: 'Proposed New INR Rate',
        //hide: (this.userRole === 'RateCardSupplier' ? false : this.userRole === 'RateCardAdmin'? false : true),
      },
      {
        headerName: 'Proposed New USD Rate',
        field: 'ProposedNewUSDRate',
        sortable: false,
        filter: true,
        width: 100,
        headerTooltip: 'Proposed New USD Rate',
        //hide: (this.userRole === 'RateCardCommercial' ? false : this.userRole === 'RateCardAdmin'? false : true ),
      },
      {
        headerName: 'Proposed New WorkPackage',
        field: 'ProposedNewWorkPackageName',
        sortable: false,
        filter: true,
        width: 100,
        headerTooltip: 'Proposed New WorkPackage',
        //hide: (this.userRole === 'RateCardSupplier' ? false : this.userRole === 'RateCardAdmin'? false : true ),
      },
      {
        headerName: 'Status',
        field: 'Status',
        sortable: false,
        filter: true,
        width: 100,
        // hide: !this.isUserAuthorizedForColumns(),
      },
      // {
      //   headerName: 'Actions',
      //   cellRenderer: 'actionRenderer',
      //   cellRendererParams: {
      //     onEditClick: this.editDashboardItem.bind(this),
      //     // onDeleteClick: this.deleteDashboardItem.bind(this),
      //     // onApproveClick: this.approveDashboardItem.bind(this),
      //     userRole: this.userRole,
      //   },
      //   width: 150,
      //   sortable: false,
      //   filter: false,
      //   cellStyle: { textAlign: 'center' },
      // },      

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
        // actionRenderer: ActionRendererComponent,
        // approveRenderer: ApproveRendererComponent,
      },
      pagination: true,
      paginationPageSize: 5,
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
          this.fetchDataFromApi();
        }
      },
      (err) => {
        this.toastr.error('Something went wrong', 'Error', {toastComponent: ToastermessageComponent});
      }
    );
  }

  ngOnInit() {
    this.fetchDataFromApi();
  }

  fetchDataFromApi() {
    this.rcdService.getRateCardDetailsbyStatus('Submitted').subscribe(
      (response: any) => {
        //const data = response.data;        
        const data= this.userRole=='RateCardAdmin'? response.data : 
        (this.userRole=='RateCardSupplier'? ( response.data.filter((x:any)=>x.status=="Submitted" || x.status=="ApprovedbyCommercial"))
        : (response.data.filter((x:any)=>x.status=="Submitted" || x.status=="ApprovedbySupplier")))

        this.rowData = [];
        this.gridOptions.api?.setRowData(this.rowData);
  
        var distinctWorkPacks = [
          ...new Set(data.map((item: { workPack: any }) => item.workPack)),
        ];
        
        for (var workPack of distinctWorkPacks) {
          var filteredWorkPackData = data.filter((x:any)=> x.workPack ==workPack) ;

          var obj: any = {};
          obj.Group = [];
          obj.GroupId = [];

          //obj.id = [];
          for (var item of filteredWorkPackData) {
            obj.RateCardId = item.rateCardId;
            obj.Vendor = item.vendorName;
            obj.VendorId = item.vendorId;
            obj.WorkPackage = item.workPack;
            obj.InrRate = item.inrRate;
            obj.UsdRate = item.usdRate;
            obj.ProposedNewINRRate = item.newProposedINRRate;
            obj.ProposedNewUSDRate = item.newProposedUSDRate;
            obj.ProposedNewWorkPackageName = item.newProposedWorkPackageName;
            obj.AccountIndicator =item.accountIndicator;
            obj.Status = item.status;
            obj.Comment=item.comment;
            if (this.groupList.length > 0) {
              var filteredResult = this.groupList.find(
                (x: { id: any }) => x.id == item.groupId
              );
              if (filteredResult != undefined && filteredResult != null) {
                obj.Group.push(filteredResult.label);
                obj.GroupId.push(filteredResult.id);
              }
            }
          }
  
          if (Array.isArray(obj.Group)) {
            obj.Group = obj.Group.join(',');
            obj.GroupId = obj.GroupId.join(',');
          }
          
          this.rowData.push(obj);
        }
  
        this.gridOptions.api?.setRowData(this.rowData);
      },
      (error: any) => {
        console.error('Error fetching data from API:', error);
      }
    );
  }

  onFirstDataRendered(params: any) {
    console.log('hi');
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  approve(){
    //debugger;
    this.rowData.map(item => item.Status = "Approved");
    this.rowData.map(item => item.RejectionComment = this.formData.comment);
    const RateCardData = this.rowData;

    //console.log(JSON.stringify(RateCardData));

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
      data:{
        message: 'Do you want to Approve?',
        actionButton: 'Yes'
      },      
      maxWidth: '100vw',
      maxHeight: '100vh',
      //height: '30%',
      width: '30%',
      panelClass: ['full-screen-modal', 'no-scrollbar']
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.spinner.show();
        this.rcdService.ApproveRejectRateCardData(RateCardData).subscribe(
          (response: any) => {
            //debugger;
            if (response.StatusCode === 200) {
              this.spinner.hide();
              this.toastr.success('Data Approved Successfully', 'Done', { toastComponent: ToastermessageComponent });
              this.rowData =[];
              this.gridOptions.api?.setRowData([]);
            } else {
              this.spinner.hide();
              this.toastr.error('Please check data. Error while Approving', 'Error', { toastComponent: ToastermessageComponent });
            }
          },
          (error: any) => {
            //console.error('Error approving rate card data:', error);
            this.toastr.error('Please check data. Error while Approving', 'Error', { toastComponent: ToastermessageComponent });
          }
        );
      }
    });
  }

  reject(){
    if (this.formData.comment) {
    this.rowData.map(item => item.Status = "Rejected"); 
    this.rowData.map(item => item.RejectionComment = this.formData.comment);
    var RateCardData = this.rowData;

    //console.log(JSON.stringify(RateCardData));

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
    data:{
      message: 'Do you want to Reject?',
      actionButton: 'Yes'
    },      
    maxWidth: '100vw',
    maxHeight: '100vh',
   // height: '30%',
    width: '30%',
    panelClass: ['full-screen-modal', 'no-scrollbar']
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.spinner.show();
        this.rcdService.ApproveRejectRateCardData(RateCardData).subscribe(
          (response: any) => {
            if (response.StatusCode === 200) {
              this.spinner.hide();
              this.toastr.success('Data Rejected Successfully', 'Done', { toastComponent: ToastermessageComponent });
            } else {
              this.spinner.hide();
              this.toastr.error('Please check data. Error while Rejecting', 'Error', { toastComponent: ToastermessageComponent });
            }
          },
          (error: any) => {
            //console.error('Error rejecting rate card data:', error);
            this.toastr.error('Please check data. Error while rejecting', 'Error', { toastComponent: ToastermessageComponent });
          }
        );
        //console.log('Rejection Comment:', this.formData.comment);
      }
    });
  }
   else {
    this.formData.commentRequired = true; 
    this.toastr.error('Please Enter comment', 'Error', { toastComponent: ToastermessageComponent });
  }
}

}

