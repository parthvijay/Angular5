import { TestBed, inject } from '@angular/core/testing';

import { ChartUtilitiesService } from './chart-utilities.service';

describe('ChartUtilitiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartUtilitiesService]
    });
  });

  it('should be created', inject([ChartUtilitiesService], (service: ChartUtilitiesService) => {
    expect(service).toBeTruthy();
  }));
});
