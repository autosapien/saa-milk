import { Component } from '@angular/core';
import { DeptDataService } from '../services/dept-data.service';

@Component({
  selector: 'app-about',
  templateUrl: 'milk.page.html',
  styleUrls: ['milk.page.scss']
})
export class MilkPage {

  constructor(
    public deptService: DeptDataService) {
  }

}
