import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePageSevenComponent } from './advance-page-seven.component';

describe('AdvancePageSevenComponent', () => {
  let component: AdvancePageSevenComponent;
  let fixture: ComponentFixture<AdvancePageSevenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancePageSevenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePageSevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
