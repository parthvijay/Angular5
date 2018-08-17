import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifyDisqualifyComponent } from './qualify-disqualify.component';

describe('QualifyDisqualifyComponent', () => {
  let component: QualifyDisqualifyComponent;
  let fixture: ComponentFixture<QualifyDisqualifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualifyDisqualifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifyDisqualifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
