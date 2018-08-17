import { TestBed, inject } from '@angular/core/testing';

import { SiteLocationsService } from './site-locations.service';

describe('SiteLocationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SiteLocationsService]
    });
  });

  it('should be created', inject([SiteLocationsService], (service: SiteLocationsService) => {
    expect(service).toBeTruthy();
  }));
});
