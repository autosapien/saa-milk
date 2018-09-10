import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DeptDataService } from '../services/dept-data.service';
import { VisitorEntryPage } from '../visitor-entry/visitor-entry.page';
import { isEmpty } from '../../utils/object';


@Component({
  selector: 'app-visitors',
  templateUrl: 'visitors.page.html',
  styleUrls: ['visitors.page.scss']
})
export class VisitorsPage {

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

  constructor(
    public deptService: DeptDataService,
    public modalController: ModalController,
    public toastController: ToastController
    ) {
  }

  async onDidTapVisitorsEnter() {
    await this.showModalVisitorsEntry();
  }

  public async showModalVisitorsEntry(data = {}) {

    // show modal form to add visitor data
    const modal = await this.modalController.create({
      component: VisitorEntryPage,
      componentProps: data
    });
    await modal.present();

    // show a toast if the data was saved
    const res = await modal.onDidDismiss();
    if (!isEmpty(res.data)) {
      const toast = await this.toastController.create({
        message: 'Visitor data was added successfully',
        duration: 1000,
      });
      toast.present();
    }
  }

}
