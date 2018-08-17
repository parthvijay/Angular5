import { TestBed, inject } from '@angular/core/testing';

import { CreatePipelineService } from './create-pipeline.service';

describe('CreatePipelineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreatePipelineService]
    });
  });

  it('should be created', inject([CreatePipelineService], (service: CreatePipelineService) => {
    expect(service).toBeTruthy();
  }));
});
