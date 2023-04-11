import { Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { BranchService } from '../services/branch.service';
import { Branch } from '../models/Branch';
import { UntypedFormBuilder } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface Places{
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
  places: Places[] = [
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
  pageSize = 1;
  currentPage = 0;
  pageSizeOptions: number[] = [1, 3, 5, 10];
  message: string = '';
  isLoading: boolean = false;

  //Variables for Expanded Grid
  displayedColumnsWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement : Branch | null;
  placesDisplayColumns: string[] = ['placeId','placeName','tariffAmount','edit'];

  constructor(private branchService: BranchService){
    //this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngOnInit() {
    //Instead of getBranches call searchBranches (POST)
    //this.getBranches();
    this.searchBranches();
  }

  ngAfterViewInit(){
    //  this.dataSource.paginator = this.paginator;
    //  this.dataSource.sort = this.sort;
  }

  getBranches(){
    this.branchService.getBranches().subscribe(response=>{
      this.branches = response;
      this.reloadBranchTable(this.branches);
      console.log(this.branches);
    });
  }

  reloadBranchTable(branches)
  {
    //this.dataSource = new MatTableDataSource(branches);
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;  
    this.dataSource.data = branches.branches;
    this.message= branches.message;
    console.log(this.dataSource);
    this.setDefaultSort();
    this.setPagination(branches.totalRecords);
  }

  setPagination(length){
    this.paginator.pageIndex = this.currentPage;
    this.paginator.length = length;
    this.totalRows = length;
  }

  setDefaultSort(){
    const sortState: Sort = {active: 'branchCode', direction: 'asc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.totalRows = event.length;
    console.log("Page Size " + event.pageSize);
    console.log("Page Index " + event.pageIndex);
    //Call Search Branches
    this.searchBranches();
  }

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
      console.log(response);
      this.reloadBranchTable(response);
      this.isLoading = false;
    }, (response: any) => {
      this.branches = response.error.branches;
      console.log(response);
      this.reloadBranchTable(response.error);
      this.isLoading = false;
    });
    console.log(searchObj);
  }

  editRecord(element: any, place: any){
    alert(element.branchCode + ' -> ' + place.placeId);
  }


  applyFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    var filterValue = target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
