import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisqualifyComponent } from './disqualify.component';

describe('DisqualifyComponent', () => {
  let component: DisqualifyComponent;
  let fixture: ComponentFixture<DisqualifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisqualifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisqualifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
