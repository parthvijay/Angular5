import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteLocationsComponent } from './site-locations.component';

describe('SiteLocationsComponent', () => {
  let component: SiteLocationsComponent;
  let fixture: ComponentFixture<SiteLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
