import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNineComponent } from './page-nine.component';

describe('PageNineComponent', () => {
  let component: PageNineComponent;
  let fixture: ComponentFixture<PageNineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
