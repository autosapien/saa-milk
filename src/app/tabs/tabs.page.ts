import { Component } from '@angular/core';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
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

  constructor(
    public events: Events,
    public router: Router
  ) {
    // listen to the event when a user selects a dept in the UI
    events.subscribe('department:didSelect', (deptCode, deptFunctions) => {
      this.tabsForUser = [];
      for (const f of deptFunctions) {
        this.tabsForUser.push(this.tabsVisibleByFunction.get(f));
      }
      this.refreshVisbleTabs();
      // this.navigateToActionTab();
    });
  }

  refreshVisbleTabs() {
    this.tabVisibleMilk = this.tabsForUser.includes('Milk');
    this.tabVisibleMilkServed = this.tabsForUser.includes('Milk Served');
    this.tabVisibleVisitors = this.tabsForUser.includes('Visitors');
  }

  /**
   * If there is only one action tab for the user navigate to it
   */
  navigateToActionTab() {
    const numActionTabs = Number(this.tabVisibleMilk) +
      Number(this.tabVisibleVisitors) +
      Number(this.tabVisibleMilkServed);
    if (numActionTabs === 1) {
      if (this.tabVisibleVisitors) { this.router.navigateByUrl('tabs/(visitors:visitors)'); }
      if (this.tabVisibleMilk) { this.router.navigateByUrl('tabs/(milk:milk)'); }
      if (this.tabVisibleMilkServed) { this.router.navigateByUrl('tabs/(milk-served:milk-served)'); }
    }
  }

}
