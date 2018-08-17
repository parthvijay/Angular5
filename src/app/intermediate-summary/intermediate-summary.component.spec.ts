import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediateSummaryComponent } from './intermediate-summary.component';

describe('IntermediateSummaryComponent', () => {
  let component: IntermediateSummaryComponent;
  let fixture: ComponentFixture<IntermediateSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntermediateSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntermediateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
