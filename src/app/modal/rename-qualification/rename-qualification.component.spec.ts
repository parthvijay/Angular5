import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameQualificationComponent } from './rename-qualification.component';

describe('RenameQualificationComponent', () => {
  let component: RenameQualificationComponent;
  let fixture: ComponentFixture<RenameQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
