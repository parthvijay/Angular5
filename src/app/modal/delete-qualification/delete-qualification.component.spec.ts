import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteQualificationComponent } from './delete-qualification.component';

describe('DeleteQualificationComponent', () => {
  let component: DeleteQualificationComponent;
  let fixture: ComponentFixture<DeleteQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
