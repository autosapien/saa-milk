import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { DeptDataService } from '../services/dept-data.service';

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

  selectedDept = '';
  deptList: Array<{ id: string, name: string, selected: boolean }>;

  constructor(
    public nav: NavController,
    public platform: Platform,
    public router: Router,
    public loadingCtrl: LoadingController,
    public googlePlus: GooglePlus,
    public deptService: DeptDataService
  ) {
    this.initialize();
  }

  /**
    * Initialize the app
    *   - After the platform is ready
    *   - Try a silent login
    *   - Prepare the dairy DataProvider with the user user
    *   - Load dairies that this user has access to
    */
  async initialize() {
    try {
      await this.platform.ready();
      await this.silentLogin();
      await this.deptService.initialize(this.user.email, this.user.accessToken);
      await this.loadDeptments();
    } catch (eroor) {
    }
  }

  async silentLogin() {
    try {
      const res = await this.googlePlus.trySilentLogin(this.googlePlusLoginObj);
      this.loadUserFromResult(res);
      this.user.isLoggedIn = true;
    } catch (error) {
      // silent login failed. do nothing. The user will login manaully
      console.log('login error: ', error);
    }
  }

  async login() {
    try {
      const res = await this.googlePlus.login(this.googlePlusLoginObj);
      this.loadUserFromResult(res);
      this.user.isLoggedIn = true;
      await this.deptService.initialize(this.user.email, this.user.accessToken);
      await this.loadDeptments();
    } catch (error) {
      // do nothing if the login failed, the UI will remain at Login button
    }
  }

  loadUserFromResult(res) {
    this.user.displayName = res.displayName;
    this.user.email = res.email;
    this.user.imageUrl = res.imageUrl;
    this.user.accessToken = res.accessToken;
    this.user.idToken = res.idToken;
  }

  async logout() {
    await this.googlePlus.logout();
    this.user.displayName = '';
    this.user.email = '';
    this.user.imageUrl = '';
    this.user.accessToken = '';
    this.user.idToken = '';
    this.user.isLoggedIn = false;

    // create selected dairy info also
    this.selectedDept = '';
    this.deptList = [];

    // clear the depratment service state
    this.deptService.clear();
  }

  async loadDeptments() {
    // show a loading... message
    const loading = await this.loadingCtrl.create({
      message: 'Loading Departments...'
    });
    await loading.present();

    // load departments via the service. If a dept was alredy selected (during last use) set that too
    try {
      this.deptList = await this.deptService.getDepts();
      for (const dept of this.deptList) {
        if (dept.selected) { this.selectedDept = dept.id; }
      }
    } catch (error) {
    } finally {
      loading.dismiss();
    }
  }

  onDeptSelected() {
    // when a valid dept is selected in the UI, goto the milk page for that dept
    if ((this.selectedDept !== '') && (this.selectedDept !== undefined)) {  // on app start we get undefined so guard against that
      this.deptService.selectedDeptCode = this.selectedDept;
      this.deptService.selectedDeptName = this.deptService.depts[this.selectedDept];
      this.router.navigateByUrl('tabs/(about:about)');  // goto the Milk Tab
    }
  }


}
