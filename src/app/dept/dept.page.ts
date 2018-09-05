import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus';

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
    ) {
    }
}
