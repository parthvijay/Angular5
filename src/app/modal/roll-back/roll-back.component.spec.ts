import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollBackComponent } from './roll-back.component';

describe('RollBackComponent', () => {
  let component: RollBackComponent;
  let fixture: ComponentFixture<RollBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
