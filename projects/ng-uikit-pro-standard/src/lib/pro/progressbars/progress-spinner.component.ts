import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'mdb-spinner',
  templateUrl: 'progress-spinner.component.html',
  styleUrls: ['./progressbars-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgressSpinnerComponent implements AfterViewInit {
  el: ElementRef;
  addClass: String = 'spinner-blue-only';
  isBrowser = false;
  @Input() spinnerType = '';
  @Input() spinnerColor = 'rainbow';

  constructor(el: ElementRef, @Inject(PLATFORM_ID) platformId: string) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.el = el;
  }

  ngAfterViewInit() {
    const hostElem = this.el.nativeElement;
    const colorClass = this.spinnerColor;
    this.addClass = 'spinner-rainbow';

    switch (colorClass) {
      case 'green':
        this.addClass = 'spinner-green-only';
        break;
      case 'blue':
        this.addClass = 'spinner-blue-only';
        break;
      case 'yellow':
        this.addClass = 'spinner-yellow-only';
        break;
      case 'red':
        this.addClass = 'spinner-red-only';
        break;
      case 'rainbow':
        this.addClass = 'spinner-rainbow spinner-blue-only mat-progress-spinner';
        this.spinerRun();
        break;
    }
    hostElem.children[0].children[0].className += ' ' + this.addClass;
  }

  spinerRun() {
    let counter = 0;
    const hostElem = this.el.nativeElement;
    if (this.isBrowser) {
      setInterval(() => {
        switch (counter) {
          case 0:
            this.addClass = 'spinner-red-only mat-progress-spinner ';
            break;
          case 1:
            this.addClass = 'spinner-yellow-only mat-progress-spinner';
            break;
          case 2:
            this.addClass = 'spinner-blue-only mat-progress-spinner';
            break;
          case 3:
            this.addClass = 'spinner-green-only mat-progress-spinner';
            break;
        }

        hostElem.children[0].children[0].className = ' ' + this.addClass;
        if (counter < 3) {
          counter++;
        } else {
          counter = 0;
        }
      }, 1333);
    }
  }
}
