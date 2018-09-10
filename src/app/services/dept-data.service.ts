import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { isEmpty } from '../../utils/object';


enum DeptServiceOp {
  getACL
}

export enum DeptFunction {
  MILK_SEND = 0,
  MILK_RECEIVE,
  VISITOR_SEND,
  VISITOR_RECEIVE,
  MILK_SERVE,
  CHEESE_SEND,
  CHEESE_RECEIVE
}


const KEY_STORAGE_LASTUSEDDEPT = 'lastUsedDeptCode';

@Injectable({
  providedIn: 'root'
})
export class DeptDataService {

  // user related state
  public email = '';
  private accessToken = '';

  // all departments
  public deptNames = new Map<string, string>(); // dept code -> dept name
  public deptFunctions = new Map<string, Array<DeptFunction>>(); // dept code -> dept functions
  public deptDataUris = new Map<string, string>(); // dept code -> dept data sheet uri
  public deptsArray: Array<{
    code: string,
    name: string,
    dataUri: string,
    functions: Array<DeptFunction>
  }> = [];  // array of all depts

  private _selectedDeptCode = '';
  get selectedDeptCode() { return this._selectedDeptCode; }
  set selectedDeptCode(value: string) {
    this._selectedDeptCode = value;
    this.storage.set(KEY_STORAGE_LASTUSEDDEPT, value);
  }
  public selectedDeptName = '';

  // access control for depts
  private aclSheetId = '1UAXDtuuH2qY4-U-ACQFmL9UC7j-hnYpyes7eM9HVtAs';
  private aclSheetRange = 'A2:E30';  // we wont ever have more than 28 departments
  private aclByDept = new Map<string, Array<string>>();
  private aclByEmail = new Map<string, Array<string>>();

  // remote data access script related
  private dataScriptId = '12tSxmhB3uwe8d8e8auq5luAcqOLSn0yRpcsqkAIm5pZWdHF_puO-hPlQ';

  constructor(
    public http: HttpClient,
    public storage: Storage) {
  }

  /**
   * Initialize the Srvice Provder with the accessToken and email of the user.
   * The accessToken is used to access the assets on Google Drive
   * @param email The email of the user
   * @param accessToken The access token attached with the email
   */
  public initialize(email: string, accessToken: string): void {
    this.accessToken = accessToken;
    this.email = email;
  }

  /**
   * Make the URI for operations pertaining to Google Drive
   * @param op The opertaion to be performed
   * @param deptCode The department whose operation is being performed
   */
  private makeUriForOperation(op: DeptServiceOp, deptCode?: string) {
    const sheetsUri = 'https://sheets.googleapis.com/v4/spreadsheets/';
    switch (op) {
      case DeptServiceOp.getACL: {
        return sheetsUri + this.aclSheetId + '/values/' + this.aclSheetRange + '?access_token=' + this.accessToken;
      }
    }
  }

  /**
   * Load the Access control data from the ACL spreadsheet
   */
  private async loadAccessControlData(): Promise<any> {
    const uri = this.makeUriForOperation(DeptServiceOp.getACL);
    return new Promise<string>((resolve, reject) => {
      this.http.get(uri).subscribe(data => {
        resolve(data['values']);
      }, err => {
        reject(err);
      });
    });
  }

  /**
   * Build the aclByEmail and aclByDept of this user. Also buils the list of all departments
   */
  private async buildAcl() {
    const res = await this.loadAccessControlData();

    // setup deptNames, deptFunctions, deptsArray and for the user aclByDept and aclByEmail
    this.deptNames.clear();
    this.deptFunctions.clear();
    this.deptDataUris.clear();
    this.deptsArray = [];
    for (const row of res) {
      // from row to representative data
      const deptCode = row[0];
      const deptName = row[1];
      const deptDataUri = row[2];
      const emails = row[4].split('\n');
      const deptFunctionsStr = row[3].split('\n');
      const deptFunctions = deptFunctionsStr.map((i) => DeptFunction[i]);

      // add row data to deparments
      this.deptNames[deptCode] = deptName;
      this.deptFunctions[deptCode] = deptFunctions;
      this.deptDataUris[deptCode] = deptDataUri;
      this.deptsArray.push({ code: deptCode, name: deptName, dataUri: deptDataUri, functions: deptFunctions });

      // add row data to user acl
      this.aclByDept[deptCode] = emails;
      for (const email of emails) {
        if (this.aclByEmail[email] === undefined) {
          this.aclByEmail[email] = [deptCode];    // create a new key as it does not exisit
        } else {
          this.aclByEmail[email].push(deptCode);
        }
      }
    }
  }

  /**
   * Return an array of objects with depts accessible by the current user
   */
  public async getDepts(): Promise<Array<{ id: string, name: string, selected: boolean }>> {

    // build the acl for all users
    if (isEmpty(this.aclByEmail)) {
      await this.buildAcl();
    }

    // get acl fof this user
    const aclOfThisUser = this.aclByEmail[this.email];

    // get the department the user last used while using this app
    const lastUsedDeptCode = await this.storage.get(KEY_STORAGE_LASTUSEDDEPT);

    // build the array of depts accessible to this user
    const res = [];
    for (const deptCode of aclOfThisUser) {
      res.push({ id: deptCode, name: this.deptNames[deptCode], selected: lastUsedDeptCode === deptCode });
    }
    return res;
  }

  public async addEntry(data): Promise<boolean> {
    return true;
  }

  public async updateEntry(data): Promise<boolean> {
    return false;
  }

  /**
   * Clears the state of the Singleton Service Provider
   */
  public clear() {
    this.email = '';
    this.accessToken = '';
    this.deptNames.clear();
    this.deptFunctions.clear();
    this.deptsArray = [];
    this.selectedDeptCode = '';
    this.selectedDeptName = '';
    this.aclByDept.clear();
    this.aclByEmail.clear();
  }

}
