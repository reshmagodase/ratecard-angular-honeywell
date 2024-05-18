import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastermessageComponent } from 'src/app/shared/toastermessage/toastermessage.component';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/Services/api-service';
import { RcdService } from 'src/app/Services/rcd-service';
import { UsageTrackerService } from 'src/app/Services/usage-tracker.service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {

    // Define variables for dropdown options
    groupOptions: any[] = [];
    vendorOptions: any[] = [];
    workPackOptions: any[] = [];
    rowData: any;

    formData = {
      vendor: {
        vendorId: 0,
        vendorName: null,
      },
      sow:{
        rateCardId:0,
        workPack: null,
        accountIndicator: null,
      },
      sowRate: null,
      sowRateUSD: null,
      newproposedinrRate: null,
      newproposedusdRate: null,
      group:{
        groupId: [0],
        groupName: [''],
      }
    };
  
    @ViewChild('rateCardForm') rateCardForm!: NgForm;

    constructor(
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService, 
    private spinner: NgxSpinnerService,
    public usageTrackerService: UsageTrackerService,
    public apiService: ApiService,
    public rcdService: RcdService,
    @Inject(MAT_DIALOG_DATA) public data: any
      ) { }

      ngOnInit(): void {
        this.loadGroups();
        // this.getAllGroup();
      }
      
      validate(){
        if (!this.formData.vendor.vendorId) {
          this.toastr.error("Vendor is required", "Error", { toastComponent: ToastermessageComponent });
          return false;
        }
        return true;
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
    
      // WorkPackSelectionChange(id: any) {
      //   console.log('Selected ID:', id);
      //   var obj = this.workPackOptions.filter(function(item:any){
      //     return item.id === id;
      //   });
      //   if (obj.length > 0) {
      //     this.formData.sow.rateCardId = obj[0].rateCardId;
      //     this.formData.sow.workPack = obj[0].workPack;
      //   }
      // }
    
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
    
      onCancel(form: NgForm) {
       // this.router.navigate(['/rate-card-dashboard']);
        this.dialogRef.close();
      }

      onSave(form: NgForm) {
        if (this.validate() && form.valid) {
          const newEntry = {
            VendorId: this.formData.vendor.vendorId,
            Vendor: this.formData.vendor.vendorName,
            WorkPackage: this.formData.sow.workPack,
            INRRate: this.formData.sowRate,
            USDRate: this.formData.sowRateUSD,
            ProposedNewINRRate: this.formData.newproposedinrRate,
            ProposedNewUSDRate: this.formData.newproposedusdRate,
            GroupId: this.formData.group.groupId.join(','),
            Group: this.formData.group.groupName.join(','),
            AccountIndicator: this.formData.sow.accountIndicator,
            Status: 'Submitted',
          };
          // this.rowData.push(newEntry);
          if (this.data.gridApi) {
            this.data.gridApi.applyTransaction({ add: [newEntry] });
          }
      
          this.toastr.success('Data Added Successfully', 'Done', {
            toastComponent: ToastermessageComponent,
          });

            this.dialogRef.close(newEntry);

        }
      }
    
      // onSubmit(form: NgForm) {
      //   if (this.validate() && form.valid) {
      //     // Prepare the data to send to the API
      //     const groupIds = this.formData.group.groupId.join(',');
      //     const requestData = {
      //       WorkPackage: this.formData.sow.workPack || '',
      //       VendorId: this.formData.vendor.vendorId || 0,
      //       Vendor: this.formData.vendor.vendorName || '',
      //       GroupId: groupIds,
      //       Group: this.formData.group.groupName.join(',') || '',
      //       INRRate: this.formData.sowRate || 0,
      //       USDRate: this.formData.sowRateUSD || 0,
      //     };
      //     console.log(JSON.stringify(requestData));
      //     const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      //       disableClose: true,
      //     data:{
      //       message: 'Do you want to Submit?',
      //       actionButton: 'Yes'
      //     },      
      //     maxWidth: '100vw',
      //     maxHeight: '100vh',
      //     height: '30%',
      //     width: '30%',
      //     panelClass: ['full-screen-modal', 'no-scrollbar']
      //     });
      //     dialogRef.afterClosed().subscribe((result) => {
      //       if (result === true) {
      //         this.spinner.show();
      //         this.rcdService.saveRateCardDetails(requestData).subscribe(
      //           (response: any) => {
      //             console.log('Data saved successfully:', response);
      //             this.spinner.hide();
      //             this.toastr.success('Data Submitted Successfully', 'Done', {
      //               toastComponent: ToastermessageComponent,
      //             });
      //             this.dialogRef.close(true);
      //           },
      //           (error: any) => {
      //             console.error('Error saving data:', error);
      //           }
      //         );
      //       } else {
      //         this.spinner.hide();
      //         this.toastr.error('Please check data..Error while submitting', 'Error', {
      //           toastComponent: ToastermessageComponent,
      //         });
      //       }
      //     });
      //   }
      // }
}
