import { TestBed, inject } from '@angular/core/testing';

import { CopyLinkService } from './copy-link.service';

describe('CopyLinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CopyLinkService]
    });
  });

  it('should be created', inject([CopyLinkService], (service: CopyLinkService) => {
    expect(service).toBeTruthy();
  }));
});
