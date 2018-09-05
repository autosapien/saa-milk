import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { MilkPageModule } from '../milk/milk.module';
import { DeptPageModule } from '../dept/dept.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    DeptPageModule,
    MilkPageModule,
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
