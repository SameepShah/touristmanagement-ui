import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AddBranch } from '../models/AddBranch';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { BranchService } from '../services/branch.service';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition,} from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css']
})
export class AddBranchComponent implements OnInit {
  constructor(private branchService: BranchService,
    public dialogRef: MatDialogRef<AddBranchComponent>,
    private _snackBar: MatSnackBar,
    private _authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
    
    branch: AddBranch | null;
    //Loader
    isLoading: boolean = false;

    //SnackBar
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    durationInSeconds: 5;

    //Check Authorization
    public isAuthorized: boolean = false;

    addBranchForm = new FormGroup({
      branchCodeControl : new FormControl('', [Validators.required, Validators.maxLength(50)]),
      branchNameControl : new FormControl('', [Validators.required, Validators.maxLength(100)]),
      emailFormControl : new FormControl('', [Validators.required, Validators.email]),
      websiteFormControl:  new FormControl('', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
      contactFormControl: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]),
      andaman: new FormControl('',[Validators.required]),
      thailand: new FormControl('',[Validators.required]),
      dubai: new FormControl('',[Validators.required]),
      singapore: new FormControl('',[Validators.required]),
      malaysia: new FormControl('',[Validators.required])
    });
    
    matcher = new MyErrorStateMatcher();
    onNoClick(): void {
      this.dialogRef.close();
    }

    ngOnInit() {
      var userRole = this._authService.GetRole();
      if(userRole == "Company")
        this.isAuthorized = true;
      else
        this.isAuthorized = false;
      //console.log(this.data);
    }

    addBranch(){
      this.isLoading = true;
      if(this.addBranchForm.invalid){
        this.openSnackBar('Please provide valid details to add branch.');
      }
      else{
        var addBranchObj = {
          branchCode: this.addBranchForm.get('branchCodeControl').value,
          branchName: this.addBranchForm.get('branchNameControl').value,
          email:this.addBranchForm.get('emailFormControl').value,
          website: this.addBranchForm.get('websiteFormControl').value,
          contact: this.addBranchForm.get('contactFormControl').value,
          places:[{
              "placeId": "1",
              "placeName": "ANDAMAN",
              "tariffAmount": this.addBranchForm.get('andaman').value
          },
          {
              "placeId": "2",
              "placeName": "THAILAND",
              "tariffAmount": this.addBranchForm.get('thailand').value
          },
          {
              "placeId": "3",
              "placeName": "DUBAI",
              "tariffAmount": this.addBranchForm.get('dubai').value
          },
          {
              "placeId": "4",
              "placeName": "SINGAPORE",
              "tariffAmount": this.addBranchForm.get('singapore').value
          },
          {
              "placeId": "5",
              "placeName": "MALAYSIA",
              "tariffAmount": this.addBranchForm.get('malaysia').value
          }]
        }
        console.log(addBranchObj);
        this.branchService.addBranch(addBranchObj).subscribe((response: any)=>{
          //On Add Success reload Branches on Branch Component
          this.isLoading = false;
          this.openSnackBar('Branch added successfully.');
          this.dialogRef.close('success');
          
        }, (response: any) => {
          this.isLoading = false;
          console.log(response);
          this.openSnackBar(response.error);
        });
      }
    }

    openSnackBar(message: string) {
      this._snackBar.open(message, 'Ok', { 
        horizontalPosition: this.horizontalPosition,  
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000
      });
    }
  
    

}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
