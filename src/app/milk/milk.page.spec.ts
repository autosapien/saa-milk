import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkPage } from './milk.page';

describe('MilkPage', () => {
  let component: MilkPage;
  let fixture: ComponentFixture<MilkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MilkPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
