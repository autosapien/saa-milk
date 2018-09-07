import { Component } from '@angular/core';
import { Events } from '@ionic/angular';
import { DeptFunction } from '../services/dept-data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  tabsVisibleByFunction = new Map<DeptFunction, string>([
    [DeptFunction.MILK_RECEIVE, 'Milk'],
    [DeptFunction.MILK_RECEIVE, 'Milk'],
    [DeptFunction.MILK_SERVE, 'Milk Served'],
    [DeptFunction.VISITOR_SEND, 'Visitors'],
    [DeptFunction.VISITOR_RECEIVE, 'Visitors'],
  ]);

  tabsForUser = [];
  tabVisibleMilk = false;
  tabVisibleMilkServed = false;
  tabVisibleVisitors = false;

  constructor(public events: Events) {
    // listne to the event whena  user signs in and his dept data is sent
    events.subscribe('department:didSelect', (deptCode, deptFunctions) => {
      this.tabsForUser = [];
      for (const f of deptFunctions) {
        this.tabsForUser.push(this.tabsVisibleByFunction.get(f));
      }
      this.refreshVisbleTabs();
    });
  }

  refreshVisbleTabs() {
    this.tabVisibleMilk = this.tabsForUser.includes('Milk');
    this.tabVisibleMilkServed = this.tabsForUser.includes('Milk Served');
    this.tabVisibleVisitors = this.tabsForUser.includes('Visitors');
  }

}
