import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePipelineTechnologyIbComponent } from './create-pipeline-technology-ib.component';

describe('CreatePipelineTechnologyIbComponent', () => {
  let component: CreatePipelineTechnologyIbComponent;
  let fixture: ComponentFixture<CreatePipelineTechnologyIbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePipelineTechnologyIbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePipelineTechnologyIbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
