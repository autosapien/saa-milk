import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorsPage } from './visitors.page';

describe('VisitorsPage', () => {
  let component: VisitorsPage;
  let fixture: ComponentFixture<VisitorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisitorsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
