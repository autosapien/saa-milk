import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

enum DeptServiceOp {
  getACL
}

@Injectable({
  providedIn: 'root'
})
export class DeptDataService {

  // user related state
  private email = '';
  private accessToken = '';

  // dairy related state
  public depts = new Map<string, string>();   // diary code to dairy name mapping
  public selectedDeptCode = '';
  public selectedDeptName = '';

  // access control for depts
  private controlSheetId = '1UAXDtuuH2qY4-U-ACQFmL9UC7j-hnYpyes7eM9HVtAs';
  private controlSheetRange = 'A2:C30';  // we wont ever have more than 28 departments
  private aclByDept = new Map<string, Array<string>>();
  private aclByEmail = new Map<string, Array<string>>();

  // remote data access script related
  private dataScriptId = '12tSxmhB3uwe8d8e8auq5luAcqOLSn0yRpcsqkAIm5pZWdHF_puO-hPlQ';

  constructor(
    public http: HttpClient) {
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
        return sheetsUri + this.controlSheetId + '/values/' + this.controlSheetRange + '?access_token=' + this.accessToken;
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
   * Build the aclByEmail and aclByDept of this user
   */
  private async buildAcl() {
    const res = await this.loadAccessControlData();

    // setup the aclByDempt and aclByEmail
    for (const row of res) {
      this.depts[row[0]] = row[1];
      const emails = row[2].split('\n');
      this.aclByDept[row[0]] = emails;
      for (const email of emails) {
        if (this.aclByEmail[email] === undefined) {
          this.aclByEmail[email] = [row[0]];
        } else {
          this.aclByEmail[email].push(row[0]);
        }
      }
    }
  }

  /**
   * Return an array of objects with depts accessible by the current user
   */
  public async getDepts(): Promise<Array<{ id: string, name: string }>> {

    // build the acl for all users
    if (isEmpty(this.aclByEmail)) {
      await this.buildAcl();
    }

    // get acl fof this user
    const aclOfThisUser = this.aclByEmail[this.email];

    // build and return an array of depts accessible by the user
    const res = [];
    for (const deptId of aclOfThisUser) {
      res.push({ id: deptId, name: this.depts[deptId] });
    }
    return res;
  }


  /**
   * Clears the state of the Singleton Service Provider
   */
  public clear() {
    this.email = '';
    this.accessToken = '';
    this.depts = new Map<string, string>();
    this.selectedDeptCode = '';
    this.selectedDeptName = '';
    this.aclByDept = new Map<string, Array<string>>();
    this.aclByEmail = new Map<string, Array<string>>();
  }

}

// utils
function isEmpty( obj ): boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

