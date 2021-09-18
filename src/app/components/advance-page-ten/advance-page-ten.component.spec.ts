import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePageTenComponent } from './advance-page-ten.component';

describe('AdvancePageTenComponent', () => {
  let component: AdvancePageTenComponent;
  let fixture: ComponentFixture<AdvancePageTenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancePageTenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePageTenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
