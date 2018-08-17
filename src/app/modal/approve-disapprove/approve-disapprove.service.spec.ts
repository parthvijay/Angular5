import { TestBed, inject } from '@angular/core/testing';

import { ApproveDisapproveService } from './approve-disapprove.service';

describe('ApproveDisapproveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApproveDisapproveService]
    });
  });

  it('should be created', inject([ApproveDisapproveService], (service: ApproveDisapproveService) => {
    expect(service).toBeTruthy();
  }));
});
