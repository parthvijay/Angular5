import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePipelineServiceAllComponent } from './create-pipeline-service-all.component';

describe('CreatePipelineServiceAllComponent', () => {
  let component: CreatePipelineServiceAllComponent;
  let fixture: ComponentFixture<CreatePipelineServiceAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePipelineServiceAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePipelineServiceAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
