import { TestBed, inject } from '@angular/core/testing';

import { QualifyDisqualifyService } from './qualify-disqualify.service';

describe('QualifyDisqualifyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QualifyDisqualifyService]
    });
  });

  it('should be created', inject([QualifyDisqualifyService], (service: QualifyDisqualifyService) => {
    expect(service).toBeTruthy();
  }));
});
