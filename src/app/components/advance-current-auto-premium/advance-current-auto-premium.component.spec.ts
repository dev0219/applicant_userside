import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceCurrentAutoPremiumComponent } from './advance-current-auto-premium.component';

describe('AdvanceCurrentAutoPremiumComponent', () => {
  let component: AdvanceCurrentAutoPremiumComponent;
  let fixture: ComponentFixture<AdvanceCurrentAutoPremiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceCurrentAutoPremiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceCurrentAutoPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
