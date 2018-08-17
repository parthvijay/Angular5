import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDisapprovalComponent } from './confirm-disapproval.component';

describe('ConfirmDisapprovalComponent', () => {
  let component: ConfirmDisapprovalComponent;
  let fixture: ComponentFixture<ConfirmDisapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDisapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDisapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
