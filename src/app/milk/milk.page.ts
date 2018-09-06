import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, AlertController, Events } from '@ionic/angular';
import { DeptDataService } from '../services/dept-data.service';

@Component({
  selector: 'app-about',
  templateUrl: 'milk.page.html',
  styleUrls: ['milk.page.scss']
})
export class MilkPage {

    selMonth: number = new Date().getMonth();
    selYear: number = new Date().getFullYear();

    yearList: Array<{ id: number, year: string }> = [
        { id: 2018, year: '2018' },
        { id: 2019, year: '2019' },
        { id: 2020, year: '2020' }
    ];

    monthList: Array<{ id: number, month: string }> = [
        { id: 0, month: 'January' },
        { id: 1, month: 'February' },
        { id: 2, month: 'March' },
        { id: 3, month: 'April' },
        { id: 4, month: 'May' },
        { id: 5, month: 'June' },
        { id: 6, month: 'July' },
        { id: 7, month: 'August' },
        { id: 8, month: 'September' },
        { id: 9, month: 'October' },
        { id: 10, month: 'November' },
        { id: 11, month: 'December' },
    ];

    monthAlertOpts: { title: string } = {title: 'Select Month'};
    yearAlertOpts: { title: string } = {title: 'Select Year'};

    constructor(
        public nav: NavController,
        public platform: Platform,
        public loadingCtrl: LoadingController,
        public events: Events,
        public alertController: AlertController,
        public deptService: DeptDataService
      ) {
        // check if a dairy has been set for the user. Without a dairy send the user back to the home screen
        events.subscribe('tabs:onViewMilkTab', () => {
            console.log('onviewmilktab Event');
        });
    }

}
