import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { window } from './../../free/utils/facade/browser';

@Component({
  selector: 'mdb-sidenav, mdb-side-nav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['./sidenav-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidenavComponent implements AfterViewInit, OnDestroy, OnInit {
  public windwosWidth: number;
  public shown: boolean;
  public slimSidenav = false;
  public isBrowser: any = false;

  private _sidenavTransform = 'translateX(-100%)';

  @Input() public class: string;
  @Input() public fixed = true;
  @Input() sidenavBreakpoint: any;

  @Input()
  get side() {
    return this._side;
  }

  set side(position: string) {
    if (position === 'left') {
      this._sidenavTransform = 'translateX(-100%)';
      this.renderer.removeClass(this.sideNav.nativeElement, 'side-nav-right');
    } else {
      this._sidenavTransform = 'translateX(100%)';
      this.renderer.addClass(this.sideNav.nativeElement, 'side-nav-right');
    }
    this._side = position;
  }

  private _side = 'left';
  @ViewChild('sidenav', { static: true }) public sideNav: ElementRef;
  @ViewChild('overlay', { static: true }) public overlay: any;

  constructor(
    @Inject(PLATFORM_ID) platformId: string,
    public el: ElementRef,
    public renderer: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.sidenavBreakpoint && this.sidenavBreakpoint >= window.innerWidth) {
      this.hide();
    }
  }

  ngAfterViewInit() {
    if (this._side === 'right') {
      this.renderer.addClass(this.sideNav.nativeElement, 'side-nav-right');
    }
    if (this.isBrowser) {
      const sidenav = this.el.nativeElement;
      const sidenavChildren = sidenav.children[0].children;
      const sidenavMask = this.el.nativeElement.querySelector('.sidenav-bg');

      let sidenavChildrenHeight = 0;

      if (sidenavMask) {
        for (let i = 0; i < sidenavChildren.length; i++) {
          if (sidenavChildren[i].classList.contains('sidenav-bg')) {
            continue;
          } else {
            for (let j = 0; j < sidenavChildren[i].children.length; j++) {
              sidenavChildrenHeight += sidenavChildren[i].children[j].scrollHeight;
            }
          }
        }
        this.renderer.setStyle(sidenavMask, 'min-height', sidenavChildrenHeight + 16 + 'px');
      }

      // pobraneie szerokosci okna po init
      this.windwosWidth = window.innerWidth;

      if (this.sidenavBreakpoint) {
        if (this.fixed) {
          this.renderer.addClass(document.body, 'fixed-sn');

          if (this.windwosWidth < +this.sidenavBreakpoint + 1) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
            this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
            this.setShown(false);
          } else {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
            this.setShown(true);
          }
        } else {
          this.renderer.addClass(document.body, 'hidden-sn');
          this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
          this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
          this.setShown(false);
        }
      } else {
        if (this.fixed) {
          this.renderer.addClass(document.body, 'fixed-sn');

          if (this.windwosWidth < 1441) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
            this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
            this.setShown(false);
          } else {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
            this.setShown(true);
          }
        } else {
          this.renderer.addClass(document.body, 'hidden-sn');
          this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
          this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
          this.setShown(false);
        }
      }
    }
  }

  @HostListener('window:resize')
  windwosResize() {
    if (this.isBrowser) {
      this.windwosWidth = window.innerWidth;
      if (this.sidenavBreakpoint) {
        if (this.fixed) {
          if (this.windwosWidth < +this.sidenavBreakpoint + 1) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
            this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
            this.setShown(false);
          }

          if (this.windwosWidth > +this.sidenavBreakpoint && this.shown) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
            this.hideOverlay();
            this.setShown(true);
          } else if (this.windwosWidth > +this.sidenavBreakpoint) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
            this.hideOverlay();
            this.setShown(true);
          }
        } else {
          if (this.windwosWidth > +this.sidenavBreakpoint) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
            this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
            this.hideOverlay();
            this.setShown(false);
          }
        }
      } else {
        if (this.fixed) {
          if (this.windwosWidth < 1441) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
            this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
            this.setShown(false);
          }

          if (this.windwosWidth > 1440 && this.shown) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
            this.hideOverlay();
            this.setShown(true);
          } else if (this.windwosWidth > 1440) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
            this.hideOverlay();
            this.setShown(true);
          }
        } else {
          if (this.windwosWidth > 1440) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
            this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
            this.hideOverlay();
            this.setShown(false);
          }
        }
      }
    }
  }

  show() {
    if (this.isBrowser) {
      if (this.sidenavBreakpoint) {
        if (this.fixed) {
          if (this.windwosWidth < +this.sidenavBreakpoint + 1) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
            this.setShown(true);
            this.showOverlay();
          } else {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
            this.setShown(true);
          }
        } else {
          this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
          this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
          this.setShown(true);
          this.showOverlay();
        }
      } else {
        if (this.fixed) {
          if (this.windwosWidth < 1441) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
            this.setShown(true);
            this.showOverlay();
          } else {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
            this.setShown(true);
          }
        } else {
          this.renderer.setStyle(this.sideNav.nativeElement, 'transform', 'translateX(0%)');
          this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0%)');
          this.setShown(true);
          this.showOverlay();
        }
      }
    }
  }

  hide() {
    if (this.isBrowser) {
      if (this.sidenavBreakpoint) {
        if (this.fixed) {
          if (this.windwosWidth < +this.sidenavBreakpoint + 1) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
            this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
            this.setShown(false);
            this.hideOverlay();
          } else {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
            this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
            this.setShown(false);
          }
        } else {
          this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
          this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
          this.setShown(false);
          this.hideOverlay();
        }
      } else {
        if (this.fixed) {
          if (this.windwosWidth < 1441) {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
            this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
            this.setShown(false);
            this.hideOverlay();
          } else {
            this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
            this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
            this.setShown(false);
          }
        } else {
          this.renderer.setStyle(this.sideNav.nativeElement, 'transform', this._sidenavTransform);
          this.renderer.setStyle(this.el.nativeElement, 'transform', this._sidenavTransform);
          this.setShown(false);
          this.hideOverlay();
        }
      }
    }
  }

  toggle() {
    if (this.shown) {
      this.hide();
    } else {
      this.show();
    }
  }

  public toggleSlim() {
    const sidenavOverlay = this.el.nativeElement.querySelector('.sidenav-bg');
    const linksHeading = this.el.nativeElement.querySelectorAll('mdb-accordion-item-head');
    this.slimSidenav = !this.slimSidenav;

    linksHeading.forEach((el: any) => {
      if (this.slimSidenav) {
        this.renderer.addClass(el, 'overflow-hidden');
      } else {
        this.renderer.removeClass(el, 'overflow-hidden');
      }
    });

    this.renderer.addClass(this.sideNav.nativeElement, 'overflow-hidden');

    if (this.slimSidenav) {
      this.renderer.addClass(this.sideNav.nativeElement, 'slim');
      this.renderer.addClass(sidenavOverlay, 'slim');
    } else {
      this.renderer.removeClass(this.sideNav.nativeElement, 'slim');
      this.renderer.removeClass(sidenavOverlay, 'slim');
    }
  }

  showOverlay() {
    this.renderer.setStyle(this.overlay.nativeElement, 'display', 'block');
    setTimeout(() => {
      this.renderer.setStyle(this.overlay.nativeElement, 'opacity', '1');
    }, 0);
  }

  hideOverlay() {
    this.renderer.setStyle(this.overlay.nativeElement, 'opacity', '0');
    setTimeout(() => {
      this.renderer.setStyle(this.overlay.nativeElement, 'display', 'none');
    }, 200);
  }

  setShown(value: boolean) {
    setTimeout(() => {
      this.shown = value;
    }, 510);
  }

  ngOnDestroy() {
    if (document.body.classList.contains('hidden-sn')) {
      this.renderer.removeClass(document.body, 'hidden-sn');
    } else if (document.body.classList.contains('fixed-sn')) {
      this.renderer.removeClass(document.body, 'fixed-sn');
    }
  }
}
