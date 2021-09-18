import {
  Component,
  ContentChild,
  Input,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { SBItemBodyComponent } from './sb-item.body';
import { MdbAccordionService } from '../mdb-accordion.service';

@Component({
  exportAs: 'sbItem',
  selector: 'mdb-item, mdb-accordion-item',
  templateUrl: 'sb-item.html',
})
export class SBItemComponent implements AfterViewInit, AfterContentInit {
  @Input() public collapsed = true;
  @Input() customClass: string;

  public idModifier = Math.floor(Math.random() * 1000);

  @ContentChild(SBItemBodyComponent, { static: false }) body: SBItemBodyComponent;

  constructor(private accordionService: MdbAccordionService, private _cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.body !== undefined) {
      setTimeout(() => {
        this.collapsed
          ? (this.body.expandAnimationState = 'collapsed')
          : (this.body.expandAnimationState = 'expanded');
      }, 0);
      this.body.toggle(this.collapsed);
    }
  }

  ngAfterContentInit() {
    setTimeout(() => {
      if (this.body && this.body.expandAnimationState === 'expanded') {
        this.collapsed = false;
      }
    }, 40);
    if (this.body) {
      this.body.id = `mdb-accordion-body-${this.idModifier}`;
    }
  }

  toggle(collapsed: boolean) {
    this.accordionService.didItemToggled(this);
    this.applyToggle(collapsed);
  }

  applyToggle(collapsed: boolean) {
    if (this.body !== undefined) {
      this.collapsed = collapsed;
      this.body.toggle(collapsed);
      this._cdRef.markForCheck();
    }
  }
}
