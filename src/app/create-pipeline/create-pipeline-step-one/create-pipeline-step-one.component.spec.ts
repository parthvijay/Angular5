import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePipelineStepOneComponent } from './create-pipeline-step-one.component';

describe('CreatePipelineStepOneComponent', () => {
  let component: CreatePipelineStepOneComponent;
  let fixture: ComponentFixture<CreatePipelineStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePipelineStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePipelineStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
