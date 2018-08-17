import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePipelineStepThreeComponent } from './create-pipeline-step-three.component';

describe('CreatePipelineStepThreeComponent', () => {
  let component: CreatePipelineStepThreeComponent;
  let fixture: ComponentFixture<CreatePipelineStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePipelineStepThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePipelineStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
