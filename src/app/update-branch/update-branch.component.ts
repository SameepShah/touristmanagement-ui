import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UpdateBranch } from '../models/UpdateBranch';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.css']
})
export class UpdateBranchComponent implements OnInit {

    //Check Authorization
    public isAuthorized: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateBranchComponent>,
    private _authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: UpdateBranch) { 

    }
  
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

  validateOnlyNumbers(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }

}
