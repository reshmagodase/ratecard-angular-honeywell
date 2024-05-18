import { Component, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api-service';
import { RcdService } from 'src/app/Services/rcd-service';
import { UsageTrackerService } from 'src/app/Services/usage-tracker.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { ToastermessageComponent } from 'src/app/shared/toastermessage/toastermessage.component';

interface DialogData {
  gridItem: any; 
}

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent {
  @ViewChild('rateCardForm', { static: false }) rateCardForm!: NgForm;

  // Define variables for dropdown options
  groupOptions: any[] = [];
  vendorOptions: any[] = [];
  workPackOptions: any[] = [];

  // Initialize form data
  formData = {
    vendor: {
      vendorId: 0,
      vendorName: null,
    },
    sow:{
      rateCardId:0,
      workPack: '',
      proposedworkPack: null,
     // accountIndicator: '',
    },
    sowRate: null,
    sowRateUSD: null,
    newproposedinrRate: null,
    newproposedusdRate: null,
    accountIndicator: null,
    group:{
      groupId: [0],
      groupName: [''],
    }
  };

  workPackMapping: {[workPack: string]: number}={};

  constructor(
    private dialogRef: MatDialogRef<EditDialogComponent>,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService, 
    private spinner: NgxSpinnerService,
    public usageTrackerService: UsageTrackerService,
    public apiService: ApiService,
    public rcdService: RcdService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // console.log('Received gridItem:', this.data);
  }

  ngOnInit(): void {
    this.loadGroups();
    if(this.data.gridItem){
      this.populateData(this.data.gridItem);
    }
  }

  populateData(gridItem: any){
    this.formData.sow.rateCardId = gridItem.RateCardId;

    this.loadRateCardDetails();
  }

  loadRateCardDetails() {
    const RateCardIdToFetch = this.formData.sow.rateCardId;
    if (!RateCardIdToFetch) {
      console.error('No rateCardId found for the selected workPack.');
      return;
    }
    this.spinner.show(); 

    this.rcdService.getRateCardDetailsbyId(RateCardIdToFetch).subscribe(
      (response: any) => {
        if (response.code === 200) {
          const rcp = response.data;
        if(rcp.length>0)
        {
          this.formData.sowRate = rcp[0].inrRate;
          this.formData.sowRateUSD = rcp[0].usdRate;
          this.formData.newproposedinrRate = rcp[0].newProposedINRRate;
          this.formData.newproposedusdRate = rcp[0].newProposedUSDRate;
          this.formData.sow.proposedworkPack = rcp[0].newProposedWorkPackageName;
          this.formData.vendor.vendorName = rcp[0].vendorName;
          this.formData.vendor.vendorId = rcp[0].vendorId;
          this.formData.sow.rateCardId =rcp[0].rateCardId;
          this.formData.sow.workPack =rcp[0].workPack;
          this.formData.group.groupId = rcp.map((x:any) => x.groupId);
          this.formData.group.groupName = rcp.map((x:any) => x.groupName);
          this.formData.accountIndicator =rcp[0].accountIndicator;
        }
        //console.log("Response:", JSON.stringify(this.formData));
        //console.log("Response:", JSON.stringify(rcp));
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
    this.workPackMapping[obj[0].workPack] = obj[0].rateCardId;

    this.loadRateCardDetails();
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

  onSave(form: NgForm) {
    if(form.valid){
      const newEntry = {
        VendorId: this.formData.vendor.vendorId,
        Vendor: this.formData.vendor.vendorName,
        WorkPackage: this.formData.sow.workPack,
        INRRate: this.formData.sowRate,
        USDRate: this.formData.sowRateUSD,
        RateCardId:this.formData.sow.rateCardId,
        ProposedNewINRRate: this.formData.newproposedinrRate,
        ProposedNewUSDRate: this.formData.newproposedusdRate,
        GroupId: this.formData.group.groupId.join(','),
        Group: this.formData.group.groupName.join(','),
        ProposedNewworkPackageName: this.formData.sow.proposedworkPack,
        AccountIndicator: this.formData.accountIndicator,
        Status: 'Submitted',
      };   
      // this.rowData.push(newEntry);
      this.toastr.success('Data Added Successfully', 'Done', {
        toastComponent: ToastermessageComponent,
      });
        this.dialogRef.close(newEntry);
    }
  }

  // updateForm() {
  //   const RateCardData = {
  //     VendorId: this.formData.vendor.vendorId,
  //     Vendor: this.formData.vendor.vendorName,
  //     RateCardId: this.formData.sow.rateCardId,
  //     WorkPackage: this.formData.sow.workPack,
  //     ProposedNewworkPackageName: this.formData.sow.proposedworkPack,
  //     INRRate: this.formData.sowRate,
  //     USDRate: this.formData.sowRateUSD,
  //     ProposedNewINRRate: this.formData.newproposedinrRate,
  //     ProposedNewUSDRate: this.formData.newproposedusdRate,
  //     GroupId: this.formData.group.groupId.join(','), 
  //     Group: this.formData.group.groupName.join(','),
  //     AccountIndicator: this.formData.accountIndicator,
  //     Status: 'Submitted', 
  //   };
  //   console.log("Response:", JSON.stringify(RateCardData));
  //   const dialogRef = this.dialog.open(ConfirmationModalComponent, {
  //     disableClose: true,
  //     data:{
  //       message: 'Do you want to Update?',
  //       actionButton: 'Yes'
  //     },      
  //     maxWidth: '100vw',
  //     maxHeight: '100vh',
  //     height: '30%',
  //     width: '30%',
  //     panelClass: ['full-screen-modal', 'no-scrollbar']
  //     });
  
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result === true) {
  //       this.spinner.show();
  //       this.rcdService.updateRateCardData(RateCardData).subscribe(
  //         (response: any) => {
  //           if (response.StatusCode === 200) {
  //             this.spinner.hide();
  //             this.toastr.success('Data Updated Successfully', 'Done', {
  //               toastComponent: ToastermessageComponent 
  //             });
  //             this.dialogRef.close(true);
  //           } else {
  //             this.spinner.hide();
  //             this.toastr.error('Please check data. Error while updating', 'Error', {
  //               toastComponent: ToastermessageComponent 
  //             });
  //           }
  //         },
  //         (error: any) => {
  //           console.error('Error updating rate card data:', error);
  //           this.toastr.error('Please check data. Error while submitting', 'Error', {
  //             toastComponent: ToastermessageComponent
  //           });
  //         }
  //       );
  //     } else {
  //       // this.dialogRef.close();
  //     }
  //   });
  //   // this.dialogRef.close();
  // }
  
  clearForm(){
    this.dialogRef.close();
  }

}
