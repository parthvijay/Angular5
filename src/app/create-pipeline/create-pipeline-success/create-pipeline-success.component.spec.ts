import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePipelineSuccessComponent } from './create-pipeline-success.component';

describe('CreatePipelineSuccessComponent', () => {
  let component: CreatePipelineSuccessComponent;
  let fixture: ComponentFixture<CreatePipelineSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePipelineSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePipelineSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
