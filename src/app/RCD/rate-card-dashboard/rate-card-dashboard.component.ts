import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, ColumnApi, GridOptions } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { ToastermessageComponent } from 'src/app/shared/toastermessage/toastermessage.component';
import { ApiService } from 'src/app/Services/api-service';
import { RcdService } from 'src/app/Services/rcd-service';
import { UsageTrackerService } from 'src/app/Services/usage-tracker.service';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { ApproveDialogComponent } from '../approve-dialog/approve-dialog.component';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import * as XLSX from 'xlsx-js-style';
import * as XLSXStyle from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ExcelServiceService } from './../../Services/excel-service.service';

@Component({
  selector: 'app-rate-card-dashboard',
  templateUrl: './rate-card-dashboard.component.html',
  styleUrls: ['./rate-card-dashboard.component.css'],
})
export class RateCardDashboardComponent {
  rowData: any[] = [];
  gridOptions: GridOptions = {};
  columnDefs: ColDef[] = [];
  selectedColumns = [];
  defaultColDef: any;
  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;
  allColumns: any = [];
  groupList: any = [];
  userRole: any = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public usageTrackerService: UsageTrackerService,
    public apiService: ApiService,
    public rcdService: RcdService,
    public excelService: ExcelServiceService
  ) {

    this.userRole = this.apiService.userDetails.listOfRoleName.indexOf('RateCardAdmin') > -1;
    // this.userRole = 'RateCardAdmin';

    this.columnDefs = [
      {
        headerName: 'Rate Card Id',
        field: 'rateCardId',
        sortable: true,
        filter: true,
        width: 50,
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        sortable: true,
        filter: true,
        width: 100,
        headerTooltip: 'Vendor Name',
      },
      {
        headerName: 'SOW', field: 'workPack', sortable: true,
        filter: true
      },
      {
        headerName: 'Current INR Rate',
        field: 'inrRate',
        sortable: true,
        filter: true,
        width: 100
      },
      {
        headerName: 'Current USD Rate',
        field: 'usdRate',
        sortable: true,
        filter: true,
        width: 100
      },
      { headerName: 'Group', field: 'groupName', sortable: false, filter: false, width: 150 },
      {
        headerName: 'Proposed New INR Rate',
        field: 'newProposedINRRate',
        sortable: true,
        filter: true,
        width: 100,
        headerTooltip: 'Proposed New INR Rate',
      },
      {
        headerName: 'Proposed New USD Rate',
        field: 'newProposedUSDRate',
        sortable: true,
        filter: true,
        width: 100,
        headerTooltip: 'Proposed New USD Rate',
      },
      {
        headerName: 'Proposed New SOW Name',
        field: 'newProposedWorkPackageName',
        sortable: true,
        filter: true,
        width: 100,
        headerTooltip: 'Proposed New WorkPackage',
      },
      {
        headerName: 'Account Indicator',
        field: 'accountIndicator',
        sortable: true,
        filter: true,
        width: 100,
      },
      {
        headerName: 'Status',
        field: 'status',
        sortable: true,
        filter: true,
        width: 100,
        //hide: !this.isUserAuthorizedForColumns(), // Hide if userRole is not 'supplier'
      },
      // {
      //   headerName: 'Actions',
      //   cellRenderer: 'actionRenderer',
      //   cellRendererParams: {
      //     onEditClick: this.editDashboardItem.bind(this),
      //     onDeleteClick: this.deleteDashboardItem.bind(this),
      //     onApproveClick: this.approveDashboardItem.bind(this),
      //     userRole: this.userRole,
      //   },
      //  width: 150,
      //  sortable: false,
      //  filter: false,
      //  cellStyle: { textAlign: 'center' },
      // hide: !this.isUserAuthorizedForActions(),
      //},

      // {
      //   headerName: 'Approve',
      //   cellRenderer: 'approveRenderer',
      //   cellRendererParams: {
      //     onApproveClick: this.approveDashboardItem.bind(this),
      //     userRole: 'supplier', // Replace with actual user role
      //   },
      //   width: 100,
      //   sortable: false,
      //   filter: false,
      //   cellStyle: { textAlign: 'center' },
      //   hide: !this.isUserAuthorizedForApprove(),
      // },
    ];

    this.selectedColumns = this.allColumns.map((x: { value: any }) => x.value);
    this.getAllGroup();

    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
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
          this.fetchDataFromApi();
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
    this.fetchDataFromApi();
  }

  fetchDataFromApi() {
    this.rcdService.getRateCardDetails().subscribe(
      (response: any) => {
        const data = response.data;

        this.rowData = [];
        this.gridOptions.api?.setRowData(this.rowData);

        var distinctWorkPacks = [
          ...new Set(data.map((item: { workPack: any }) => item.workPack)),
        ];
        console.log(distinctWorkPacks);
        for (var workPack of distinctWorkPacks) {
          var filteredWorkPackData = data.filter(
            (x: { workPack: unknown }) => x.workPack == workPack
          );
          var obj: any = {};
          obj.groupName = [];
          obj.groupId = [];
          obj.id = [];
          for (var item of filteredWorkPackData) {
            obj.rateCardId = item.rateCardId;
            obj.vendorName = item.vendorName;
            obj.workPack = item.workPack;
            obj.inrRate = item.inrRate;
            obj.usdRate = item.usdRate;
            obj.newProposedINRRate = item.newProposedINRRate;
            obj.newProposedUSDRate = item.newProposedUSDRate;
            obj.newProposedWorkPackageName = item.newProposedWorkPackageName;
            obj.accountIndicator =item.accountIndicator;
            obj.status = item.status;
            if (this.groupList.length > 0) {
              var filteredResult = this.groupList.find(
                (x: { id: any }) => x.id == item.groupId
              );
              if (filteredResult != undefined && filteredResult != null) {
                obj.groupName.push(filteredResult.label);
              }
            }
          }

          if (Array.isArray(obj.groupName)) {
            obj.groupName = obj.groupName.join(',');
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
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  addrc() {
    this.router.navigateByUrl('/add-rate-card');
  }

  generateExcelReport() {
    const data = this.rowData;

    const workPackages = Array.from(
      new Set(data.map((item: any) => item.workPack))
    );
    const vendors = Array.from(
      new Set(data.map((item: any) => item.vendorName))
    );

    // Create the header row with vendor names
    const header = ['Work Package', ...vendors, 'USD Rate (per hr basis)', 'Account Indicator'];

    // Create an object to hold rates for each work package and vendor combination
    const ratesByWorkPackageVendor: {
      [workPack: string]: { [vendor: string]: any };
    } = {};

    // Initialize the rates object with zeros
    for (const workPack of workPackages) {
      const workPackString = workPack as string;
      ratesByWorkPackageVendor[workPackString] = {};
      for (const vendor of vendors) {
        const vendorName = vendor as string;
        ratesByWorkPackageVendor[workPackString][vendorName] = 'NA';
      }
    }

    // Fill the rates object with INR rates for each combination
    for (const item of data) {
      ratesByWorkPackageVendor[item.workPack][item.vendorName] = item.inrRate;
      ratesByWorkPackageVendor[item.workPack]['USD Rate (per hr basis)'] = item.usdRate;
    }

    // Create formatted data for the worksheet
    var formattedRowData:any = [];
    const formattedData = workPackages.map((workPack: any) => {
      const rowData: any[] = [workPack as string];

      for (const vendor of vendors) {
        const vendorName = vendor as string;
        rowData.push(ratesByWorkPackageVendor[workPack as string][vendorName]);
      }
      formattedRowData.push(rowData);
      return rowData;

    });
    this.excelService.generateExcelForReports(header,formattedRowData,'RateCardReport.xlsx');
    // // Create a worksheet
    // const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
    //   header,
    //   ...formattedData,
    // ]);

    // // Apply styling to header row
    // const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    // for (let C = range.s.c; C <= range.e.c; ++C) {
    //   const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
    //   ws[headerCell] = {
    //     ...ws[headerCell],
    //     s: {
    //       ...ws[headerCell].s,
    //       fill: { fgColor: { rgb: 'FFFF99' } }, // Pink background color
    //       border: {
    //         left: { style: 'thin', color: { rgb: '000000' } },
    //         right: { style: 'thin', color: { rgb: '000000' } },
    //         top: { style: 'thin', color: { rgb: '000000' } },
    //         bottom: { style: 'thin', color: { rgb: '000000' } },
    //       },
    //     },
    //   };
    // }

    // // Auto-size columns
    // for (let C = range.s.c; C <= range.e.c; ++C) {
    //   const colName = XLSX.utils.encode_col(C);
    //   let maxLen = 0;

    //   // Find the maximum content length in the column
    //   for (let R = range.s.r; R <= range.e.r; ++R) {
    //     const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        
    //     if (cell && cell.v) {
    //       cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    //       const cellValue = cell.v.toString();
    //       maxLen = Math.max(maxLen, cellValue.length);
          
    //     }
    //   }

    //   // Set the column width based on the maximum content length
    //   ws[colName] = { ...ws[colName], wch: maxLen + 2 }; // Add extra padding
    // }

    // // Create a workbook
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // //set row style
    

    
    // XLSX.utils.book_append_sheet(wb, ws, 'RateCardData');

    // // Generate Excel file
    // XLSX.writeFile(wb, 'RateCardReport.xlsx');
  }

  exportToExcel() {
    const dataToExport = this.rowData.map((item) => ({
      'RateCard Id': item.rateCardId,
      'Vendor Name': item.vendorName,
      'Work Package': item.workPack,
      'Current INR Rate': item.inrRate,
      'Currrent USD Rate': item.usdRate,
      'Group': item.groupName,
      'Old INR Rate': item.oldINRRate,
      'Old USD Rate': item.oldUSDRate,
      'Proposed New INR Rate': item.newProposedINRRate,
      'Proposed New USD Rate': item.newProposedUSDRate,
      'Proposed New Work Package': item.newProposedWorkPackageName,
      'Account Indicator': item.accountIndicator,
      'Status': item.status,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

    // Define header styles
    const headerStyle = {
      fill: {
        fgColor: { rgb: 'FFFF00' }, // Yellow background
      },
      font: {
        color: { rgb: '000000' }, // Black font color
        bold: true, // Bold font
      },
      border: {
        top: { style: 'thin', color: { auto: 1 } }, // Thin top border
        bottom: { style: 'thin', color: { auto: 1 } }, // Thin bottom border
        left: { style: 'thin', color: { auto: 1 } }, // Thin left border
        right: { style: 'thin', color: { auto: 1 } }, // Thin right border
      },
    };

    // Apply styles to header row
    const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1'); // Provide a default value ('A1' in this example) if ws['!ref'] is undefined.
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const headerCell = XLSX.utils.encode_cell({ r: headerRange.s.r, c: col });
      ws[headerCell].s = headerStyle;
    }

    var headers = ['RateCard Id',
    'Vendor Name',
    'Work Package',
    'Current INR Rate',
    'Currrent USD Rate',
    'Group',
    'Old INR Rate',
    'Old USD Rate',
    'Proposed New INR Rate',
    'Proposed New USD Rate',
    'Proposed New Work Package',
    'Account Indicator',
    'Status'];
    var data:any = [];
    for(var item of dataToExport){
      var valueArray = Object.values(item);
      var tempValues= [];
      for(var value of valueArray){
        if(value !=undefined && value!=null){
          tempValues.push(value)
        }
        else{
          tempValues.push(' ');
        }
      }
      
      data.push(tempValues);
    }
    //console.log(data);
    this.excelService.generateExcelForReports(headers,data,'RCD_Report.xlsx');
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // XLSX.writeFile(wb, 'RCD_Report.xlsx');
  }


  deleteDashboardItem(id: number) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
      data: {
        message: 'Do you want to Delete?',
        actionButton: 'Yes'
      },
      maxWidth: '100vw',
      maxHeight: '100vh',
      //height: '30%',
      width: '22%',
      panelClass: ['full-screen-modal', 'no-scrollbar']
    });
    console.log('Delete Dashboard Item called with id:', id);
    const index = this.rowData.findIndex(
      (rowDataItem: { id: any }) => rowDataItem.id === id
    );
    if (index !== -1) {
      this.rowData.splice(index, 1);
      this.gridOptions.api?.setRowData(this.rowData);
    }
  }

  editDashboardItem(item: any) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchDataFromApi();
      }
    });
  }

  approveDashboardItem(item: any) {
    const dialogRef = this.dialog.open(ApproveDialogComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchDataFromApi();
      }
    });
  }

  // private isUserAuthorizedForActions() {
  //   return this.userRole === 'buyer' || this.userRole === 'admin';
  // }

  // private isUserAuthorizedForApprove() {
  //   return this.userRole === 'supplier' || this.userRole === 'admin';
  // }

  // private isUserAuthorizedForColumns() {
  //   return this.userRole === true;
  // }

}

@Component({
  selector: 'app-action-renderer',
  template: `
    <div class="action-cell">
      <i class="material-icons edit-icon" 
      (click)="onEditClick()">edit</i>
      <i class="material-icons delete-icon" 
      [hidden]="!showDeleteButton()"
      (click)="onDeleteClick()">delete</i>
      <i
        class="material-icons approve-icon"
        [class.disabled]="!isApprovable()"
        [hidden]="!showApproveButton()"
        (click)="onApproveClick()"
      >
        check_circle
      </i>
    </div>
  `,
  styles: [`
    .action-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .delete-icon,
    .edit-icon {
      cursor: pointer;
      margin: 0 4px;
    }

    .delete-icon {
      color: red;
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

  onDeleteClick() {
    const { onDeleteClick, node } = this.params;
    if (onDeleteClick && node) {
      const id = node.data.id;
      onDeleteClick(id);
    }
  }

  onEditClick() {
    console.log('Edit button clicked.');
    const { onEditClick, node } = this.params;
    if (onEditClick && node) {
      const item = node.data;
      onEditClick(item);
    }
  }

  onApproveClick() {
    if (this.isApprovable()) {
      const { onApproveClick, node } = this.params;
      if (onApproveClick && node) {
        const item = node.data;
        onApproveClick(item);
      }
    }
  }

  showApproveButton() {
    return this.params.userRole === true;
  }

  showDeleteButton() {
    return this.params.userRole === true;
  }

  isApprovable() {
    return this.showApproveButton() && this.params.node.data.status === 'Submitted';
  }

}
