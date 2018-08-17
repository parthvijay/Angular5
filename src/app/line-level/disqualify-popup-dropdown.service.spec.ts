import { TestBed, inject } from '@angular/core/testing';

import { DisqualifyPopupDropdownService } from './disqualify-popup-dropdown.service';

describe('DisqualifyPopupDropdownService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisqualifyPopupDropdownService]
    });
  });

  it('should be created', inject([DisqualifyPopupDropdownService], (service: DisqualifyPopupDropdownService) => {
    expect(service).toBeTruthy();
  }));
});
