import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-milk-entry',
  templateUrl: './milk-entry.page.html',
  styleUrls: ['./milk-entry.page.scss'],
})
export class MilkEntryPage implements OnInit {

  constructor(
    private modalController: ModalController,
    public navParams: NavParams) {
    console.log(navParams);
  }

  save() {
    this.close({
      date: '',
      timeOfDay: ''
    });
  }

  close(data) {
    console.log('close tappped');
    this.modalController.dismiss(data);
  }

  ngOnInit() {
  }

}
