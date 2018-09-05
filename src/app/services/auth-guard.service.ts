import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    public alertController: AlertController) {
  }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'No Department',
      message: 'Please Select your Department.',
      buttons: ['OK']
    });
    await alert.present();
    return false;
  }

}
