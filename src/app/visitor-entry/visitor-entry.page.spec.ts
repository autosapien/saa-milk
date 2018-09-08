import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorEntryPage } from './visitor-entry.page';

describe('VisitorEntryPage', () => {
  let component: VisitorEntryPage;
  let fixture: ComponentFixture<VisitorEntryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorEntryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
