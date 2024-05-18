import { Component, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RcdService } from 'src/app/Services/rcd-service';
import { UsageTrackerService } from 'src/app/Services/usage-tracker.service';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { ToastermessageComponent } from 'src/app/shared/toastermessage/toastermessage.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

interface DialogData {
  gridItem: any; 
}

@Component({
  selector: 'app-approve-dialog',
  templateUrl: './approve-dialog.component.html',
  styleUrls: ['./approve-dialog.component.css']
})
export class ApproveDialogComponent {
  @ViewChild('approveForm', { static: false }) approveForm!: NgForm;

  // Define variables for dropdown options
  groupOptions: any[] = [];
  vendorOptions: any[] = [];
  workPackOptions: any[] = [];
  isCommentBoxVisible: boolean = false;
  snackBarConfig: MatSnackBarConfig = {
    duration: 3000, // Duration in milliseconds
    horizontalPosition: 'start',
    verticalPosition: 'top',
  };

  // Initialize form data
  formData = {
    vendor: {
      vendorId: 0,
      vendorName: null,
    },
    sow:{
      rateCardId:0,
      workPack: null,
      proposedworkPack: null,
    },
    sowRate: null,
    sowRateUSD: null,
    newproposedinrRate: null,
    newproposedusdRate: null,
    group:{
      groupId: [0],
      groupName: [''],
    },
    accountIndicator: null,
    comment: '',
    commentRequired: false,
  };

  constructor(
    private dialogRef: MatDialogRef<ApproveDialogComponent>,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService, 
    public usageTrackerService: UsageTrackerService,
    public apiService: ApiService,
    private spinner: NgxSpinnerService,
    public rcdService: RcdService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public gridItem: any
  ) {
    console.log('Received gridItem:', this.gridItem);
  }

  ngOnInit(): void {
    this.loadGroups();
    this.loadRateCardDetails();
  }


loadRateCardDetails() {
  const RateCardIdToFetch = this.gridItem.rateCardId;

  this.spinner.show();

  this.rcdService.getRateCardDetailsbyId(RateCardIdToFetch).subscribe(
    (response: any) => {
      if (response.code === 200) {
        const rcp = response.data;

        this.formData.sowRate = rcp[0].inrRate;
        this.formData.sowRateUSD = rcp[0].usdRate;
        this.formData.newproposedinrRate = rcp[0].newProposedINRRate;
        this.formData.newproposedusdRate = rcp[0].newProposedUSDRate;
        this.formData.sow.proposedworkPack = rcp[0].newProposedWorkPackageName;
        this.formData.vendor.vendorName = rcp[0].vendorName;
        this.formData.vendor.vendorId = rcp[0].vendorId;
        this.formData.sow.rateCardId = rcp[0].rateCardId;
        this.formData.sow.workPack = rcp[0].workPack;
        this.formData.accountIndicator =rcp[0].accountIndicator;
        this.formData.group.groupId = rcp.map((x: any) => x.groupId);
        this.formData.group.groupName = rcp.map((x: any) => x.groupName);

        console.log("Response:", JSON.stringify(this.formData));
        console.log("Response:", JSON.stringify(rcp));
        this.spinner.hide();

      }
    },
    (error: any) => {
      console.error('Error fetching rate card details:', error);
      this.spinner.hide();
    }
  );
}


  VendorSelectionChange(id: any) {
    console.log('Selected ID:', id);
    var obj = this.vendorOptions.filter(function(item:any){
      return item.vendorId === id;
    });
    if (obj.length > 0) {
      this.formData.vendor.vendorId = obj[0].vendorId;
      this.formData.vendor.vendorName = obj[0].vendorName;
    }
  }

  WorkPackSelectionChange(id: any) {
    console.log('Selected ID:', id);
    var obj = this.workPackOptions.filter(function(item:any){
      return item.rateCardId === id;
    });
    if (obj.length > 0) {
      this.formData.sow.rateCardId = obj[0].rateCardId;
      this.formData.sow.workPack = obj[0].workPack;
    }
  }

  GroupSelectionChange(ids: number[]) {
    console.log('Selected IDs:', ids);
  
    const selectedGroups = [];
  
    for (const id of ids) {
      const groupOption = this.groupOptions.find((option: any) => option.groupId === id);
      if (groupOption) {
        selectedGroups.push(groupOption);
      }
    }
  
    this.formData.group.groupId = selectedGroups.map((group: any) => group.groupId);
    this.formData.group.groupName = selectedGroups.map((group: any) => group.groupName);
  }
  


  loadGroups() {
    this.rcdService.getMasterData().subscribe(
      (response: any) => {
        this.groupOptions = response.data.table;
        this.vendorOptions = response.data.table1;
        this.workPackOptions = response.data.table2;
      },
      (error: any) => {
        console.error('Error fetching groups:', error);
      }
    );
  }

  approvedForm() {
    const RateCardData = {
      VendorId: this.formData.vendor.vendorId,
      Vendor: this.formData.vendor.vendorName,
      RateCardId: this.formData.sow.rateCardId,
      WorkPackage: this.formData.sow.workPack,
      ProposedNewworkPackageName: this.formData.sow.proposedworkPack,
      INRRate: this.formData.sowRate,
      USDRate: this.formData.sowRateUSD,
      ProposedNewINRRate: this.formData.newproposedinrRate,
      ProposedNewUSDRate: this.formData.newproposedusdRate,
      GroupId: this.formData.group.groupId.join(','), 
      Group: this.formData.group.groupName.join(','),
      Status: 'Approved', 
      AccountIndicator: this.formData.accountIndicator,
    };
    console.log("Response:", JSON.stringify(RateCardData));

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
      data:{
        message: 'Are you sure you want to Approve?',
        actionButton: 'Yes'
      },      
      maxWidth: '100vw',
      maxHeight: '100vh',
      //height: '22%',
      width: '22%',
      panelClass: ['full-screen-modal', 'no-scrollbar']
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.spinner.show();
        this.rcdService.ApproveRejectRateCardData(RateCardData).subscribe(
          (response: any) => {
            if (response.StatusCode === 200) {
              this.spinner.hide();
              this.toastr.success('Data Approved Successfully', 'Done', { toastComponent: ToastermessageComponent });
            } else {
              this.spinner.hide();
              this.toastr.error('Please check data. Error while Approving', 'Error', { toastComponent: ToastermessageComponent });
            }
            this.dialogRef.close(true);
          },
          (error: any) => {
            console.error('Error approving rate card data:', error);
            this.toastr.error('Please check data. Error while Approving', 'Error', { toastComponent: ToastermessageComponent });
          }
        );
      }
    });
}


  rejectForm() {
    if (this.formData.comment) {
      const RateCardData = {
        VendorId: this.formData.vendor.vendorId,
        Vendor: this.formData.vendor.vendorName,
        RateCardId: this.formData.sow.rateCardId,
        WorkPackage: this.formData.sow.workPack,
        ProposedNewworkPackageName: this.formData.sow.proposedworkPack,
        INRRate: this.formData.sowRate,
        USDRate: this.formData.sowRateUSD,
        ProposedNewINRRate: this.formData.newproposedinrRate,
        ProposedNewUSDRate: this.formData.newproposedusdRate,
        GroupId: this.formData.group.groupId.join(','), 
        Group: this.formData.group.groupName.join(','),
        AccountIndicator: this.formData.accountIndicator,
        Comment: this.formData.comment,
        Status: 'Rejected', 
      };
      console.log("Response:", JSON.stringify(RateCardData));

      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        disableClose: true,
      data:{
        message: 'Are you sure you want to Reject?',
        actionButton: 'Yes'
      },      
      maxWidth: '100vw',
      maxHeight: '100vh',
      //height: '15%',
      width: '22%',
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
              this.dialogRef.close(true);
            },
            (error: any) => {
              console.error('Error rejecting rate card data:', error);
              this.toastr.error('Please check data. Error while rejecting', 'Error', { toastComponent: ToastermessageComponent });
            }
          );
          console.log('Rejection Comment:', this.formData.comment);
        }
      });
    } else {
      this.formData.commentRequired = true; 
      this.toastr.error('Please Enter comment', 'Error', {
        toastComponent: ToastermessageComponent,
      });
    }
}


  onCancel() {
    this.dialogRef.close();
  }  

}

