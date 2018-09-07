import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, AlertController, Events } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { DeptDataService } from '../services/dept-data.service';

@Component({
    selector: 'app-about',
    templateUrl: 'milk.page.html',
    styleUrls: ['milk.page.scss']
})
export class MilkPage {

    selMonth = String(new Date().getMonth());
    selYear = String(new Date().getFullYear());
    yearList = ['2018', '2019', '2020'];
    monthList: Array<{ id: string, month: string }> = [
        { id: '0', month: 'January' },
        { id: '1', month: 'February' },
        { id: '2', month: 'March' },
        { id: '3', month: 'April' },
        { id: '4', month: 'May' },
        { id: '5', month: 'June' },
        { id: '6', month: 'July' },
        { id: '7', month: 'August' },
        { id: '8', month: 'September' },
        { id: '9', month: 'October' },
        { id: '10', month: 'November' },
        { id: '11', month: 'December' },
    ];

    monthAlertOpts = { title: 'Select Month' };
    yearAlertOpts = { title: 'Select Year' };

    constructor(
        public navController: NavController,
        public platform: Platform,
        public loadingCtrl: LoadingController,
        public alertController: AlertController,
        public modalController: ModalController,
        public deptService: DeptDataService
    ) {
    }

}
