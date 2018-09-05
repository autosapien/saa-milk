import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService} from '../services/auth-guard.service';
import { TabsPage } from './tabs.page';
import { DeptPage } from '../dept/dept.page';
import { MilkPage } from '../milk/milk.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(dept:dept)',
        pathMatch: 'full',
      },
      {
        path: 'dept',
        outlet: 'dept',
        component: DeptPage
      },
      {
        path: 'milk',
        outlet: 'milk',
        component: MilkPage,
        canActivate: [AuthGuardService]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(dept:dept)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
