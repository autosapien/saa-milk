import { TestBed, inject } from '@angular/core/testing';

import { DeptDataService } from './dept-data.service';

describe('DeptDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeptDataService]
    });
  });

  it('should be created', inject([DeptDataService], (service: DeptDataService) => {
    expect(service).toBeTruthy();
  }));
});
