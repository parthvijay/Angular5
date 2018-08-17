import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyToAmComponent } from './notify-to-am.component';

describe('NotifyToAmComponent', () => {
  let component: NotifyToAmComponent;
  let fixture: ComponentFixture<NotifyToAmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifyToAmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyToAmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
