import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceHomeComponent } from './advance-home.component';

describe('AdvanceHomeComponent', () => {
  let component: AdvanceHomeComponent;
  let fixture: ComponentFixture<AdvanceHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
