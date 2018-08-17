import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropFiltersComponent } from './drop-filters.component';

describe('DropFiltersComponent', () => {
  let component: DropFiltersComponent;
  let fixture: ComponentFixture<DropFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
