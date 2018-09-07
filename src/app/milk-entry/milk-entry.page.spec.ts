import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkEntryPage } from './milk-entry.page';

describe('MilkEntryPage', () => {
  let component: MilkEntryPage;
  let fixture: ComponentFixture<MilkEntryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilkEntryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilkEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
