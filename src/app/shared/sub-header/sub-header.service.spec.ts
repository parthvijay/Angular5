import { TestBed, inject } from '@angular/core/testing';

import { SubHeaderService } from './sub-header.service';

describe('SubHeaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubHeaderService]
    });
  });

  it('should be created', inject([SubHeaderService], (service: SubHeaderService) => {
    expect(service).toBeTruthy();
  }));
});
