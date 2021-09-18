import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuaraceTypeSelectionComponent } from './insuarace-type-selection.component';

describe('InsuaraceTypeSelectionComponent', () => {
  let component: InsuaraceTypeSelectionComponent;
  let fixture: ComponentFixture<InsuaraceTypeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuaraceTypeSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuaraceTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
