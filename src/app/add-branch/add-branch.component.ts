import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AddBranch } from '../models/AddBranch';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css']
})
export class AddBranchComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

    }
    branch: AddBranch | null;
    addBranchForm = new FormGroup({
      branchCodeControl : new FormControl('', [Validators.required, Validators.maxLength(50)]),
      branchNameControl : new FormControl('', [Validators.required, Validators.maxLength(100)]),
      emailFormControl : new FormControl('', [Validators.required, Validators.email]),
      websiteFormControl:  new FormControl('', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
      contactFormControl: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"),Validators.minLength(10)]),
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
      console.log(this.data);
    }

    addBranch(){
      if(this.addBranchForm.invalid){
        alert("Add Branch Form is Invalid");
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
        alert("Add Branch Form is Valid");
      }

    }
    

}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
