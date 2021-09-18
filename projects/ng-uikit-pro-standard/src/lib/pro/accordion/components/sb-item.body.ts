import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  ContentChildren,
  AfterContentInit,
  QueryList,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { state, style, trigger, transition, animate } from '@angular/animations';
import { RouterLinkWithHref } from '@angular/router';
import { window } from '../../../free/utils/facade/browser';

export interface IAccordionAnimationState {
  state: string;
  accordionEl: ElementRef;
}

@Component({
  exportAs: 'sbItemBody',
  selector: 'mdb-item-body, mdb-accordion-item-body',
  templateUrl: 'sb-item.body.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('expandBody', [
      state('collapsed', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('500ms ease')),
    ]),
  ],
})
export class SBItemBodyComponent implements AfterContentInit {
  @Input() customClass: string;
  @Output() animationStateChange: EventEmitter<IAccordionAnimationState> = new EventEmitter<
    IAccordionAnimationState
  >();
  @ContentChildren(RouterLinkWithHref) routerLinks: QueryList<RouterLinkWithHref>;

  public height = '0';
  expandAnimationState = 'collapsed';

  public id = `mdb-accordion-`;
  ariaLabelledBy = '';

  @ViewChild('body', { static: true }) bodyEl: ElementRef;

  constructor(private el: ElementRef, private _cdRef: ChangeDetectorRef) {}

  toggle(collapsed: boolean) {
    setTimeout(() => {
      collapsed
        ? (this.expandAnimationState = 'collapsed')
        : (this.expandAnimationState = 'expanded');

      this._cdRef.markForCheck();
    }, 0);
  }

  animationCallback() {
    this.animationStateChange.emit({
      state: this.expandAnimationState,
      accordionEl: this.el.nativeElement.parentElement.parentElement,
    });
  }

  openSidenavOnActiveLink() {
    const pathStrategyUrl = window.location.pathname;
    const hashStrategyUrl = window.location.hash;

    const activeLink = this.routerLinks.find((link: any) => {
      return link.href === pathStrategyUrl || link.href === hashStrategyUrl;
    });

    if (activeLink) {
      setTimeout(() => {
        this.expandAnimationState = 'expanded';
      }, 40);
    }
  }

  ngAfterContentInit() {
    this.openSidenavOnActiveLink();
  }
}
