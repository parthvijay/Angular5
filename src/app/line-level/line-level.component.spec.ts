import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineLevelComponent } from './line-level.component';

describe('LineLevelComponent', () => {
  let component: LineLevelComponent;
  let fixture: ComponentFixture<LineLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
