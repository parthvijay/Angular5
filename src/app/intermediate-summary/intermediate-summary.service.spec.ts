import { TestBed, inject } from '@angular/core/testing';

import { IntermediateSummaryService } from './intermediate-summary.service';

describe('IntermediateSummaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntermediateSummaryService]
    });
  });

  it('should be created', inject([IntermediateSummaryService], (service: IntermediateSummaryService) => {
    expect(service).toBeTruthy();
  }));
});
