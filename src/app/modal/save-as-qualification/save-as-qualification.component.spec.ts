import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAsQualificationComponent } from './save-as-qualification.component';

describe('SaveAsQualificationComponent', () => {
  let component: SaveAsQualificationComponent;
  let fixture: ComponentFixture<SaveAsQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveAsQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAsQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
