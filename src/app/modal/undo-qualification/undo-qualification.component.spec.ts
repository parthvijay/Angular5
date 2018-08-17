import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoQualificationComponent } from './undo-qualification.component';

describe('UndoQualificationComponent', () => {
  let component: UndoQualificationComponent;
  let fixture: ComponentFixture<UndoQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndoQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
