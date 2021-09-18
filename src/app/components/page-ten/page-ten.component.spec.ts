import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTenComponent } from './page-ten.component';

describe('PageNineComponent', () => {
  let component: PageTenComponent;
  let fixture: ComponentFixture<PageTenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageTenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
