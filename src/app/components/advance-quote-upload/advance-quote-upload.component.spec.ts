import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceQuoteUploadComponent } from './advance-quote-upload.component';

describe('AdvanceQuoteUploadComponent', () => {
  let component: AdvanceQuoteUploadComponent;
  let fixture: ComponentFixture<AdvanceQuoteUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceQuoteUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceQuoteUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
