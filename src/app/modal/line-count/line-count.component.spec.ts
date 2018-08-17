import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineCountComponent } from './line-count.component';

describe('LineCountComponent', () => {
  let component: LineCountComponent;
  let fixture: ComponentFixture<LineCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
