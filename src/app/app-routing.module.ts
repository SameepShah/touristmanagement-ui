import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchesComponent } from './branches/branches.component';

const routes: Routes = [
  { path: 'branches', component: BranchesComponent },
  { path: '', redirectTo: '/branches', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
