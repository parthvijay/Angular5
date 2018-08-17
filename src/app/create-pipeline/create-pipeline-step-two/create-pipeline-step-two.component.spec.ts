import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePipelineStepTwoComponent } from './create-pipeline-step-two.component';

describe('CreatePipelineStepTwoComponent', () => {
  let component: CreatePipelineStepTwoComponent;
  let fixture: ComponentFixture<CreatePipelineStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePipelineStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePipelineStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
