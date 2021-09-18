import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeHomeComponent } from './life-home.component';

describe('LifeHomeComponent', () => {
  let component: LifeHomeComponent;
  let fixture: ComponentFixture<LifeHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
