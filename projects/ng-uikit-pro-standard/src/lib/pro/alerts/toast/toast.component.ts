import {
  ApplicationRef,
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { SafeHtml } from '@angular/platform-browser';

import { Subscription } from 'rxjs';

import { GlobalConfig, ToastPackage, tsConfig } from './toast.config';

@Component({
  selector: 'mdb-toast-component',
  templateUrl: './toast.component.html',
  styleUrls: ['./../alerts-module.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      state('active', style({ opacity: '{{ opacity }}' }), { params: { opacity: 0.5 } }),
      state('removed', style({ opacity: 0 })),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => removed', animate('300ms ease-in')),
    ]),
  ],
})
export class ToastComponent implements OnDestroy {
  message: string | SafeHtml;
  title: string;
  options: GlobalConfig;
  /** width of progress bar */
  width = -1;
  state = 'inactive';
  /** a combination of toast type and options.toastClass */
  @HostBinding('class') toastClasses = '';
  /** controls animation */
  @HostBinding('@flyInOut')
  get animationParams() {
    return {
      value: this.state,
      params: {
        opacity: this.opacity,
      },
    };
  }
  opacity: number | undefined;
  timeout: any;
  intervalId: any;
  hideTime: number;
  sub: Subscription;
  sub1: Subscription;
  protected toastService: any;

  constructor(public toastPackage: ToastPackage, protected appRef: ApplicationRef) {
    this.toastService = tsConfig.serviceInstance;

    this.message = toastPackage.message;
    this.title = toastPackage.title;
    this.options = toastPackage.config;
    this.toastClasses = `${toastPackage.toastType} ${toastPackage.config.toastClass}`;
    this.sub = toastPackage.toastRef.afterActivate().subscribe(() => {
      this.activateToast();
    });
    this.sub1 = toastPackage.toastRef.manualClosed().subscribe(() => {
      this.remove();
    });

    this.opacity = this.options.opacity;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
  }
  /**
   * activates toast and sets timeout
   */
  activateToast() {
    this.state = 'active';
    if (this.options.timeOut !== 0) {
      this.timeout = setTimeout(() => {
        this.remove();
      }, this.options.timeOut);
      this.hideTime = new Date().getTime() + this.options.timeOut;
      if (this.options.progressBar) {
        this.intervalId = setInterval(() => this.updateProgress(), 10);
      }
    }
    if (this.options.onActivateTick) {
      this.appRef.tick();
    }
  }
  /**
   * updates progress bar width
   */
  updateProgress() {
    if (this.width === 0) {
      return;
    }
    const now = new Date().getTime();
    const remaining = this.hideTime - now;
    this.width = (remaining / this.options.timeOut) * 100;
    if (this.width <= 0) {
      this.width = 0;
    }
  }

  /**
   * tells toastrService to remove this toast after animation time
   */
  remove() {
    if (this.state === 'removed') {
      return;
    }
    clearTimeout(this.timeout);
    this.state = 'removed';
    this.timeout = setTimeout(() => this.toastService.remove(this.toastPackage.toastId), 250);
  }

  onActionClick() {
    this.toastPackage.triggerAction();
    this.remove();
  }

  @HostListener('click')
  tapToast() {
    if (this.state === 'removed') {
      return;
    }
    this.toastPackage.triggerTap();
    if (this.options.tapToDismiss) {
      this.remove();
    }
  }
  @HostListener('mouseenter')
  stickAround() {
    if (this.state === 'removed') {
      return;
    }
    clearTimeout(this.timeout);
    this.options.timeOut = 0;
    this.hideTime = 0;

    // disable progressBar
    clearInterval(this.intervalId);
    this.width = 0;
  }
  @HostListener('mouseleave')
  delayedHideToast() {
    if (+this.options.extendedTimeOut === 0 || this.state === 'removed') {
      return;
    }
    this.timeout = setTimeout(() => this.remove(), this.options.extendedTimeOut);
    this.options.timeOut = +this.options.extendedTimeOut;
    this.hideTime = new Date().getTime() + this.options.timeOut;
    this.width = 100;
    if (this.options.progressBar) {
      this.intervalId = setInterval(() => this.updateProgress(), 10);
    }
  }
}
