import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { GooglePlusMock } from '../mock/mock';
import { Select } from '@ionic/angular';


import { DeptDataService } from '../services/dept-data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'dept.page.html',
  styleUrls: ['dept.page.scss'],
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

  selectedDeptCode = '';
  deptList: Array<{ id: string, name: string, selected: boolean }>;

  constructor(
    public nav: NavController,
    public platform: Platform,
    public router: Router,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    public googlePlus: GooglePlus,
    public deptService: DeptDataService,
    private _cdr: ChangeDetectorRef
  ) {
    this.initialize();
  }

  /**
    * Initialize the app
    *   - After the platform is ready
    *   - Try a silent login
    *   - Prepare the dairy DataProvider with the user user
    *   - Load depts that this user has access to
    */
  async initialize() {
    await this.platform.ready();
    try {
      await this.googleLogin(true);    // attempt silent login
      this.deptService.initialize(this.user.email, this.user.accessToken);
    } catch (e) {
      // silent login failed. Do nothing, allow user to login manually via UI
      return;
    }
    await this.loadDeptments();
  }

  /**
   * Attempt google login
   * @param silent If the login is silent (on app start)
   */
  async googleLogin(silent = false) {
    let res = '';
    if (silent) {
      res = await this.googlePlus.trySilentLogin(this.googlePlusLoginObj);
    } else {
      res = await this.googlePlus.login(this.googlePlusLoginObj);
    }
    this.loadUserFromResult(res);
    this.user.isLoggedIn = true;
  }

  loadUserFromResult(res) {
    this.user.displayName = res.displayName;
    this.user.email = res.email;
    this.user.imageUrl = res.imageUrl;
    this.user.accessToken = res.accessToken;
    this.user.idToken = res.idToken;
  }

  async onLoginTapped() {
    try {
      await this.googleLogin();
      this.deptService.initialize(this.user.email, this.user.accessToken);
    } catch (e) {
      if (e === 13) { // the user cancelled the login. Found by trial and error
        return;
      }
      const alert = await this.alertController.create({ header: 'Error', message: e.error, buttons: ['OK'] });
      await alert.present();
      return;
    }
    await this.loadDeptments();
  }

  async onLogoutTapped() {
    await this.googlePlus.logout();
    this.user.displayName = '';
    this.user.email = '';
    this.user.imageUrl = '';
    this.user.accessToken = '';
    this.user.idToken = '';
    this.user.isLoggedIn = false;

    // create selected dairy info also
    this.selectedDeptCode = '';
    this.deptList = [];

    // clear the depratment service state
    this.deptService.clear();
  }

  /**
   * Attempt to load departments for a user. On failure will dispaly an alert message
   */
  async loadDeptments() {
    // show a loading... message
    const loading = await this.loadingCtrl.create({
      message: 'Loading Your Departments...'
    });
    await loading.present();

    // load departments via the service. If a dept was alredy selected (during last use) set the select control's value to that
    try {
      this.deptList = await this.deptService.getDepts();
      for (const dept of this.deptList) {
        if (dept.selected) {
          // wait a bit fro the deptList to propagate then change then state of the selected department
          setTimeout( () => this.selectedDeptCode = dept.id, 320);
        }
      }
    } catch (error) {
      const errMsg = ((error.status === 401) || (error.status === 403)) ?
        'You do no have permission for this operation' :
        'Error loading departments';
      const alert = await this.alertController.create({ header: 'Error', message: errMsg, buttons: ['OK'] });
      await alert.present();
    } finally {
      loading.dismiss();
    }
  }

  onDeptSelected($event) {
    console.log('changed to:', $event.target.value);
    // when a valid dept is selected in the UI, goto the milk page for that dept
    if ((this.selectedDeptCode !== '') && (this.selectedDeptCode !== undefined)) {  // on app start we get undefined so guard against that
      this.deptService.selectedDeptCode = this.selectedDeptCode;
      this.deptService.selectedDeptName = this.deptService.depts[this.selectedDeptCode];
      this.router.navigateByUrl('tabs/(milk:milk)');  // goto the Milk Tab */
    }
  }

}
