import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'dept.page.html',
  styleUrls: ['dept.page.scss']
})
export class DeptPage {

  googlePlusLoginObj: { scopes: string, webClientId: string, offline: boolean } = {
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
    webClientId: '302690628886-t6ir7c1i349kce9qp2umiqhi1d9vdcck.apps.googleusercontent.com',
    offline: false  // https://github.com/EddyVerbruggen/cordova-plugin-googleplus/issues/464
  };

  user = {
    isLoggedIn: false,
    displayName: '',
    email: '',
    imageUrl: '',
    accessToken: '',
    idToken: ''
  };

  selectedDairy = '';
  dairyList: Array<{ id: string, name: string }>;

  constructor(
    public nav: NavController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public googlePlus: GooglePlus
  ) {
  }

  async login() {
    try {
      const res = await this.googlePlus.login(this.googlePlusLoginObj);
      this.loadUserFromResult(res);
      this.user.isLoggedIn = true;
      // await this.dairyDP.initialize(this.user.email, this.user.accessToken);
      // await this.loadDairies();
    } catch (error) {
      // do nothing as the login failed
    }
  }

  loadUserFromResult(res) {
    console.log(res);
    this.user.displayName = res.displayName;
    this.user.email = res.email;
    this.user.imageUrl = res.imageUrl;
    this.user.accessToken = res.accessToken;
    this.user.idToken = res.idToken;
  }

  async logout() {
    // await this.googlePlus.logout();
    this.user.displayName = '';
    this.user.email = '';
    this.user.imageUrl = '';
    this.user.accessToken = '';
    this.user.idToken = '';
    this.user.isLoggedIn = false;

    // create selected dairy info also
    // this.selectedDairy = '';
    // this.dairyList = [];

    // clear the dataprovider for the dairies
    // this.dairyDP.clear()
}


}
