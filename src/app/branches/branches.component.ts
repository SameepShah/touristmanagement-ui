import { Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { BranchService } from '../services/branch.service';
import { Branch } from '../models/Branch';

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }
// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];

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
    { value:'1', text:'ANDAMAN' },
    { value:'2', text:'THAILAND' },
    { value:'3', text:'DUBAI' },
    { value:'4', text:'SINGAPORE' },
    { value:'5', text:'MALAYSIA' },
  ];
  branches = new Array<Branch>();
  dataSource: MatTableDataSource<Branch>;
  constructor(private branchService: BranchService){
    //this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngOnInit() {
    this.getBranches();
    
  }

  ngAfterViewInit(){
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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
    this.dataSource = new MatTableDataSource(branches);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;  
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
