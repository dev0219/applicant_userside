import {
  AfterViewInit,
  Component,
  HostListener,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { SBItemComponent } from './sb-item';

@Component({
  exportAs: 'sbItemHead',
  selector: 'mdb-item-head, mdb-accordion-item-head',
  templateUrl: 'sb-item.head.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SBItemHeadComponent implements AfterViewInit {
  @Input() isDisabled = false;
  @Input() customClass: string;
  @Input() indicator = true;

  public id = `mdb-accordion-`;
  ariaExpanded = false;
  ariaControls = '';

  constructor(private sbItem: SBItemComponent, private _cdRef: ChangeDetectorRef) {
    this.id = `mdb-accordion-head-${this.sbItem.idModifier}`;
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if (event.keyCode === 32) {
      this.toggleClick(event);
    }
  }

  toggleClick(event: any) {
    event.preventDefault();
    if (!this.isDisabled) {
      this.sbItem.collapsed = !this.sbItem.collapsed;
      this.sbItem.toggle(this.sbItem.collapsed);
      this.ariaExpanded = !this.ariaExpanded;
    }
    this._cdRef.markForCheck();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.sbItem.body) {
        this.ariaControls = this.sbItem.body.id;
        this.sbItem.body.ariaLabelledBy = this.id;
      }
    }, 0);
  }
}
