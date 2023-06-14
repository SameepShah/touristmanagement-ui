import { Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { BranchService } from '../services/branch.service';
import { Branch } from '../models/Branch';
import { UntypedFormBuilder } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog } from '@angular/material/dialog';
import { UpdateBranchComponent } from '../update-branch/update-branch.component';
import { Place } from '../models/Place';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition,} from '@angular/material/snack-bar';
import { AddBranchComponent } from '../add-branch/add-branch.component';

export interface PlaceDropdown{
  value: string;
  text: string;
}


@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BranchesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'branchCode', 'branchName', 'website','contact','email','createdDate'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  places: PlaceDropdown[] = [
    { value:'andaman', text:'ANDAMAN' },
    { value:'thailand', text:'THAILAND' },
    { value:'dubai', text:'DUBAI' },
    { value:'singapore', text:'SINGAPORE' },
    { value:'malaysia', text:'MALAYSIA' },
  ];
  branches = new Array<Branch>();
  dataSource: MatTableDataSource<Branch> = new MatTableDataSource();
  branchCode: string = '';
  branchName: string = '';
  place: string = '';
  totalRows = 0;
  pageSize = 3; //Default PageSize
  currentPage = 0;
  pageSizeOptions: number[] = [1, 3, 5, 10]; //Pagination Options
  message: string = '';
  isLoading: boolean = false;

  //Variables for Expanded Grid
  displayedColumnsWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement : Branch | null;
  placesDisplayColumns: string[] = ['placeId','placeName','tariffAmount','edit'];
  branchPlaces: Place[] = [];

  //SnackBar
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: 5;

  constructor(private branchService: BranchService, public dialog: MatDialog, private _snackBar: MatSnackBar){
  }

  /**
   * Init Method Call Search Branches
   */
  ngOnInit() {
    this.searchBranches();
  }

  ngAfterViewInit(){
  }

  /**
   * Deprecated
   */
  getBranches(){
    this.branchService.getBranches().subscribe(response=>{
      this.branches = response;
      this.reloadBranchTable(this.branches);
    });
  }

  /***
   * Reload Branches
   */
  reloadBranchTable(branches)
  {
    this.dataSource.data = branches.branches;
    this.message= branches.message;
    this.setPagination(branches.totalRecords);
  }

  /***
   * Set Initial Pagination for Table
   */
  setPagination(length){
    this.paginator.pageIndex = this.currentPage;
    this.paginator.length = length;
    this.totalRows = length;
  }

  /***
   * Set Default Sorting for Table (Deprecated)
   */
  setDefaultSort(){
    const sortState: Sort = {active: 'branchCode', direction: 'asc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    //this.dataSource.sort = this.sort;
  }

  /**
   * Sort Change Event
   * @param event 
   */
  sortChanged(event: Sort){
    //Call Search Branches
    this.searchBranches();
  }


  /**
   * Pagination Page Change Event
   * @param event 
   */
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.totalRows = event.length;
    //Call Search Branches
    this.searchBranches();
  }

  /**
   * Search Click Event
   */
  searchClickEvent(){
    if(this.paginator&& this.paginator.pageIndex){
      this.paginator.pageIndex = 0;
      this.currentPage = 0;
    }
    this.searchBranches();
  }

  /***
   * Main method to Search/Get Branches from API with Parameters
   */
  searchBranches(){
    this.isLoading = true;
    //Call Search Branches from ngOnInit and on Search Click
    var pageIndex = this.paginator == undefined ? 1 :  this.paginator.pageIndex + 1;
    var pageSize = this.paginator == undefined ? this.pageSize : this.paginator.pageSize;
    var searchObj={
      id:'',
      BranchCode: this.branchCode,
      BranchName: this.branchName,
      Place: this.place,
      PaginationSorting: {
        PageIndex: pageIndex,
        PageSize: pageSize,
        SortColumn: this.sort == undefined ? 'branchCode' : this.sort.active,
        SortOrder: this.sort == undefined ? true : (this.sort.direction == "asc" ? true : false),
      },
    }
    this.branchService.searchBranches(searchObj).subscribe((response: any)=>{
      this.branches = response.branches;
      this.reloadBranchTable(response);
      this.isLoading = false;
    }, (response: any) => {
      if(response && response.error)
      {
        this.branches = response.error.branches;
        this.reloadBranchTable(response.error);
        this.isLoading = false;
      }
      else if(response.status == 401 || response.status == 403){
        this.isLoading = false;
        this.branches = new Array<Branch>();
        var unauthorizedResponse = {
          branches: new Array<Branch>(),
          message:'You are not authorized to view content.',
          totalRecords: 0
        };
        this.reloadBranchTable(unauthorizedResponse);
        this.openSnackBar('You are not authorized to view content.');
      }
      
    });
  }

  /***
   * Edit Record Event
   */
  editRecord(element: any, place: any){
    if (element.places) {

      const dialogRef = this.dialog.open(UpdateBranchComponent, {
        width: '250px',
        data: { branch: {...element}, place: {...place} }
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          //Prepare Database Object from returned value to Update and Call API to Update the same 
          res.tariffAmount = Number(res.tariffAmount);
          this.branchPlaces = JSON.parse(JSON.stringify(element.places));
          this.branchPlaces = this.branchPlaces.map(obj => res.placeId == obj.placeId ?  res : obj);
          var updatedObj = {
            'id': element.id,
            'branchCode': element.branchCode,
            'places': this.branchPlaces
          };
          this.branchService.updateBranch(updatedObj).subscribe((response: any)=>{
            //On Edit Success reload Branches
            this.openSnackBar('Tariff Updated Successfully.');
            this.searchBranches();
          }, (response: any) => {
            //Show Error in Snackbar AngularMaterial
            this.openSnackBar(response.error);
          });
        }
      });
    }
  }


  /**
   * Add Branch Event
   */
  addBranchClickEvent(){
    //this.openSnackBar('Add Branch Clicked');
    const dialogRef = this.dialog.open(AddBranchComponent, {
      panelClass:'add-branch-content',
      data: 'Test'
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res && res =='success') {
        this.searchBranches();
      }
      else {
      }
    });

  }

  /***
   * Table inbuilt filter (Deprecated)
   */
  applyFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    var filterValue = target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /***
   * Click Event for Snack Message (OK Event)
   */
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', { 
      horizontalPosition: this.horizontalPosition,  
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000
    });
  }

}
