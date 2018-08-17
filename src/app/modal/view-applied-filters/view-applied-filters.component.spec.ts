import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppliedFiltersComponent } from './view-applied-filters.component';

describe('ViewAppliedFiltersComponent', () => {
  let component: ViewAppliedFiltersComponent;
  let fixture: ComponentFixture<ViewAppliedFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAppliedFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppliedFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
