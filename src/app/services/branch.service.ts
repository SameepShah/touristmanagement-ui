import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Branch } from '../models/Branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(public http: HttpClient) {}

  public getBranches() : Observable<Branch[]>{
    const url = environment.branchApiUri + 'branches';
    return this.http.get<Branch[]>(url);
  }

  /**
   * Search Service Call
   * @param searchRequest 
   * @returns 
   */
  public searchBranches(searchRequest: any){
    const url = environment.adminApiUri + 'search';
    return this.http.post(url,searchRequest,{
      headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'}
    });
  }

  /**
   * Update Branch Service Call
   * @param updateObj 
   * @returns 
   */
  public updateBranch(updateObj: any){
    const url = environment.branchApiUri + 'editbranch';
    return this.http.post(url,updateObj,{
      headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'}
    });
  }

  /**
   * Add Branch Service Call
   * @param addObj 
   * @returns 
   */
  public addBranch(addObj: any){
    const url = environment.branchApiUri + 'addbranch';
    return this.http.post(url,addObj,{
      headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'}
    });
  }


}
