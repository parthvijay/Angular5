import { TestBed, inject } from '@angular/core/testing';

import { ManageTemplateService } from './manage-template.service';

describe('ManageTemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageTemplateService]
    });
  });

  it('should be created', inject([ManageTemplateService], (service: ManageTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
