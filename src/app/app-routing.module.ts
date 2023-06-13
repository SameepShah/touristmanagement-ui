import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchesComponent } from './branches/branches.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { 
    path: 'branches', 
    component: BranchesComponent, 
    canActivate: [ AuthGuard ]
  },
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: '', 
    redirectTo: '/branches', 
    pathMatch: 'full' 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
