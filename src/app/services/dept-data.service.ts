import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { isEmpty } from '../../utils/object';


enum DeptServiceOp {
  getACL,
  getEntries,
  postEntry
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
    this.selectedDeptName = this.deptNames[value];
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
   */
  private _makeUriForOperation(op: DeptServiceOp) {
    const sheetsPrefix = 'https://sheets.googleapis.com/v4/spreadsheets/';
    switch (op) {
      case DeptServiceOp.getACL: {
        return sheetsPrefix + this.aclSheetId + '/values/' + this.aclSheetRange + '?access_token=' + this.accessToken;
      }
      case DeptServiceOp.getEntries: {
        const sheetId = this._getGoogleSheetIdfromUri(this.deptDataUris[this.selectedDeptCode]);
        const range = 'B1:F3650';           // max 10 entries per day
        return sheetsPrefix + sheetId + '/values/' + range + '?access_token=' + this.accessToken;
      }
      case DeptServiceOp.postEntry: {
        const sheetId = this._getGoogleSheetIdfromUri(this.deptDataUris[this.selectedDeptCode]);
        return sheetsPrefix + sheetId + '/values/' +
          'A1:append?insertDataOption=INSERT_ROWS&valueInputOption=RAW&access_token=' + this.accessToken;
      }
    }
  }

  private _getGoogleSheetIdfromUri(uri: string): string {
    let start = uri.indexOf('/d/');
    const end = uri.indexOf('/edit');
    if ((start === -1) || (end === -1) || (start + 3 >= end)) {
      throw new Error('Your spreadsheet URI ' + uri + ' is malformed. Please fix this in the SAAMMA ACL sheet.');
    }
    start = start + 3;  // add '/d/;
    return uri.substr(start, end - start);
  }

  private _verifyDeptsLoaded() {
    if ((this.selectedDeptCode === '') || (this.deptsArray.length === 0)) {
      throw new Error('Please select a department.');
    }
  }

  /**
   * Load the Access control data from the ACL spreadsheet
   */
  private async _loadAccessControlData(): Promise<any> {
    const uri = this._makeUriForOperation(DeptServiceOp.getACL);
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
    const res = await this._loadAccessControlData();

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

  public async addEntry(data: any): Promise<boolean> {

    data['date'] = data['date'].substr(0, 10); // remove time

    this._verifyDeptsLoaded();
    const uri = this._makeUriForOperation(DeptServiceOp.postEntry);

    // setup headers
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    // setup data. date, from_dept, to_dept, quantity, by
    const postData = {
      values: [[
        data['date'],
        this.selectedDeptCode,
        'dr',
        data['numberVisitors'],
        this.email
      ]]
    };
    const postDataJson = JSON.stringify(postData);
    console.log(postDataJson);

    // make the post
    this.http.post(uri, postDataJson, { headers }).subscribe(
      result => { },
      error => false
    );
    return true;
  }

  public async updateEntry(data): Promise<boolean> {
    return false;
  }

  public async getEntries(): Promise<any> {
    this._verifyDeptsLoaded();
    const uri = this._makeUriForOperation(DeptServiceOp.getEntries);
    return new Promise<string>((resolve, reject) => {
      this.http.get(uri).subscribe(data => {
        resolve(data['values']);
      }, err => {
        reject(err);
      });
    });
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
