import { TestBed, inject } from '@angular/core/testing';

import { LineLevelService } from './line-level.service';

describe('LineLevelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LineLevelService]
    });
  });

  it('should be created', inject([LineLevelService], (service: LineLevelService) => {
    expect(service).toBeTruthy();
  }));
});
