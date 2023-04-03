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
}
