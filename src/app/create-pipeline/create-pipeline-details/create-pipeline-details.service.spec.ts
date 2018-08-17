import { TestBed, inject } from '@angular/core/testing';

import { CreatePipelineDetailsService } from './create-pipeline-details.service';

describe('CreatePipelineDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreatePipelineDetailsService]
    });
  });

  it('should be created', inject([CreatePipelineDetailsService], (service: CreatePipelineDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
