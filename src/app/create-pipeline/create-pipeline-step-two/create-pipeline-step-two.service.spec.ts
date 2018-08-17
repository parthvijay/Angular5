import { TestBed, inject } from '@angular/core/testing';

import { CreatePipelineStepTwoService } from './create-pipeline-step-two.service';

describe('CreatePipelineStepTwoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreatePipelineStepTwoService]
    });
  });

  it('should be created', inject([CreatePipelineStepTwoService], (service: CreatePipelineStepTwoService) => {
    expect(service).toBeTruthy();
  }));
});
