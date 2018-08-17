import { TestBed, inject } from '@angular/core/testing';

import { AgGridService } from './ag-grid.service';

describe('AgGridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgGridService]
    });
  });

  it('should be created', inject([AgGridService], (service: AgGridService) => {
    expect(service).toBeTruthy();
  }));
});
