import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptPage } from './dept.page';

describe('DeptPage', () => {
  let component: DeptPage;
  let fixture: ComponentFixture<DeptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeptPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
