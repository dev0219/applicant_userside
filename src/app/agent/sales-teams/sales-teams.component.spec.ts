import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTeamsComponent } from './sales-teams.component';

describe('SalesTeamsComponent', () => {
  let component: SalesTeamsComponent;
  let fixture: ComponentFixture<SalesTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
