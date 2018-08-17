import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePipelineContractsComponent } from './create-pipeline-contracts.component';

describe('CreatePipelineContractsComponent', () => {
  let component: CreatePipelineContractsComponent;
  let fixture: ComponentFixture<CreatePipelineContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePipelineContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePipelineContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
