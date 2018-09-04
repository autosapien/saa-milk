import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { DeptPage } from '../dept/dept.page';
import { AboutPage } from '../about/about.page';


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
        path: 'about',
        outlet: 'about',
        component: AboutPage
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
