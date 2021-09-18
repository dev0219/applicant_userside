import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAdavanceFiveComponent } from './page-adavance-five.component';

describe('PageAdavanceFiveComponent', () => {
  let component: PageAdavanceFiveComponent;
  let fixture: ComponentFixture<PageAdavanceFiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAdavanceFiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAdavanceFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
