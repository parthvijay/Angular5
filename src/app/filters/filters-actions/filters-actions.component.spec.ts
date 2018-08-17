import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersActionsComponent } from './filters-actions.component';

describe('FiltersActionsComponent', () => {
  let component: FiltersActionsComponent;
  let fixture: ComponentFixture<FiltersActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
