import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLabelInputComponent } from './form-label-input.component';

describe('PageNineComponent', () => {
  let component: FormLabelInputComponent;
  let fixture: ComponentFixture<FormLabelInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLabelInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLabelInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
