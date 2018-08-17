import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePipelineTechnologyAllComponent } from './create-pipeline-technology-all.component';

describe('CreatePipelineTechnologyAllComponent', () => {
  let component: CreatePipelineTechnologyAllComponent;
  let fixture: ComponentFixture<CreatePipelineTechnologyAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePipelineTechnologyAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePipelineTechnologyAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
