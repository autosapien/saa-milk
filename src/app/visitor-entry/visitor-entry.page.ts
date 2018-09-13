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
    this._setFormDate('date', this.dateDispayed);
  }

  /**
   * Move the date in the date field by n days
   * @param days The number of days to move the date in the date field
   */
  moveDate(days) {
    // get the date from the form field
    const formValue = this.form.get('date').value;

    // the form can have 2 types of values: a date object or an an boject with 3 entries (d,m,y)
    let d = null;
    if (typeof formValue === 'string') {
      d = new Date(formValue);
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    } else {
      d = new Date(formValue.year.value, formValue.month.value - 1, formValue.day.value);
    }
    d.setDate(d.getDate() + days);

    // set the value in the form
    this._setFormDate('date', d);
  }

  /**
   * Close this modal form
   * @param data
   */
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

  /**
   * Set the date field in the form
   * @param formElementName The form element that we need to set
   * @param date The date value to set to
   */
  private _setFormDate(formElementName: string, date: Date) {
    // toJSON() removes the timezone and moves the date to UTC. For example:
    // Thu Sep 13 2018 13:33:05 GMT+0530 (India Standard Time) becomes "2018-09-13T08:03:05.432Z"
    // Se we subract the offset minutes from UTC (IST is -330) to get local date as string
    const d = date;
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    this.form.get(formElementName).setValue(d.toJSON());
  }
}
