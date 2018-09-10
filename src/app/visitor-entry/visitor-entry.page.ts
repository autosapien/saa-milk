import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DeptDataService } from '../services/dept-data.service';
import { isEmpty } from '../../utils/object';


@Component({
  selector: 'app-visitor-entry',
  templateUrl: './visitor-entry.page.html',
  styleUrls: ['./visitor-entry.page.scss'],
})
export class VisitorEntryPage implements OnInit {

  form: FormGroup;
  dateDispayed = new Date();

  validationMessages = {
    'date': [
      { type: 'required', message: 'Date is required.' },
    ],
    'numberVisitors': [
      { type: 'required', message: 'Number of visitors is required.' }
    ]
  };

  constructor(
    private modalController: ModalController,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public deptService: DeptDataService,
  ) {
  }

  ngOnInit() {
    // Create the form and define fields and validators.
    this.form = this.formBuilder.group({
      numberVisitors: ['', Validators.required],
      date: ['', Validators.required],
    });

    // Initial values for the fields
    this.form.get('numberVisitors').setValue(100);
    this.form.get('date').setValue(this.dateDispayed.toJSON());
  }

  /**
   * Move the date in the date field by n days
   * @param days The number of days to move the date in the date field
   */
  moveDate(days) {
    const formValue = this.form.get('date').value;
    let d = null;
    if (typeof formValue === 'string') {
      d = new Date(formValue);
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    } else {
      console.log(formValue);
      d = new Date(formValue.year.value, formValue.month.value, formValue.day.value);
    }
    console.log(d);
    d.setDate(d.getDate() + days);
    this.form.get('date').setValue(d.toJSON());
  }

  close(data) {
    this.modalController.dismiss(data);
  }

  async onSubmit(data) {
    // show a message that the data is saving
    const loading = await this.loadingController.create({
      message: 'Saving...'
    });
    loading.present();

    // attmpt to save the data
    const res = await this.deptService.addEntry(data);

    if (res) {                // if saved return to previous screen
      loading.dismiss();
      this.close(data);
    } else {                  // if not saved dismiss show an alert message that data was not saved
      loading.dismiss();
      const msg = 'Unable to save data. Please try again.';
      const alert = await this.alertController.create({ header: 'Data Not Saved', message: msg, buttons: ['OK'] });
      await alert.present();
    }
  }

}
