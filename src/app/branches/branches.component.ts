import { Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { BranchService } from '../services/branch.service';
import { Branch } from '../models/Branch';


export interface Places{
  value: string;
  text: string;
}

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
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


  constructor(private branchService: BranchService){
    //this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngOnInit() {
    //TODO: Instead of getBranches call searchBranches (POST)
    this.getBranches();
  }

  ngAfterViewInit(){
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
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
    this.dataSource.data = branches;
    this.setDefaultSort();
    this.setPagination(branches.count);
  }

  setPagination(length){
    this.paginator.pageIndex = this.currentPage;
    this.paginator.length = length;
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
    console.log("Page Size " + event.pageSize);
    console.log("Page Index " + event.pageIndex);
    //TODO: Call Search Branches
    //this.getBranches();
  }

  searchBranches(){
    //TODO: Call Search Branches from ngOnInit and on Search Click
    var searchObj={
      id:'',
      BranchCode: this.branchCode,
      BranchName: this.branchName,
      Place: this.place,
      PaginationSorting: {
        PageIndex: this.paginator.pageIndex + 1,
        PageSize: this.paginator.pageSize,
        SortColumn: this.sort.active,
        SortOrder: this.sort.direction == "asc" ? true : false,
      },
    }
    console.log(searchObj);
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
