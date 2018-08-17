import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidentifiedDataComponent } from './unidentified-data.component';

describe('UnidentifiedDataComponent', () => {
  let component: UnidentifiedDataComponent;
  let fixture: ComponentFixture<UnidentifiedDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnidentifiedDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidentifiedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
