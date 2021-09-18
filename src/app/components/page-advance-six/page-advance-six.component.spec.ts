import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAdvanceSixComponent } from './page-advance-six.component';

describe('PageAdvanceSixComponent', () => {
  let component: PageAdvanceSixComponent;
  let fixture: ComponentFixture<PageAdvanceSixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAdvanceSixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAdvanceSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
