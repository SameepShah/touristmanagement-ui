import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UpdateBranch } from '../models/UpdateBranch';


@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.css']
})
export class UpdateBranchComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UpdateBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateBranch) { 

    }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(this.data);
  }

}
