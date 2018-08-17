import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePipelineDetailsComponent } from './create-pipeline-details.component';

describe('CreatePipelineDetailsComponent', () => {
  let component: CreatePipelineDetailsComponent;
  let fixture: ComponentFixture<CreatePipelineDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePipelineDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePipelineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
