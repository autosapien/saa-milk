import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { DeptDataService } from '../services/dept-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public router: Router,
    public deptService: DeptDataService,
    public alertController: AlertController) {
  }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {

    // check if the user is logged in
    if (this.deptService.email === '') {
      const alert = await this.alertController.create({
        header: 'Please Login',
        message: 'You need to sign in first.',
        buttons: ['OK']
      });
      await alert.present();
      return false;
    }

    // check if the user has selected a department
    if (this.deptService.selectedDeptCode === '') {
      const alert = await this.alertController.create({
        header: 'No Department',
        message: 'Please Select your Department.',
        buttons: ['OK']
      });
      await alert.present();
      return false;
    }

    return true;
  }

}
