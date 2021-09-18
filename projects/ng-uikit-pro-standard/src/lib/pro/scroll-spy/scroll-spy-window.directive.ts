import {
  Directive,
  ElementRef,
  OnInit,
  Inject,
  Renderer2,
  NgZone,
  Input,
  AfterViewInit
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ScrollSpyService } from './scroll-spy.service';

@Directive({
  selector: '[mdbScrollSpyWindow]'
})
export class ScrollSpyWindowDirective implements OnInit, AfterViewInit {
  private id: string;

  @Input('mdbScrollSpyWindow')
  get scrollSpyId(): string { return this._scrollSpyId; }
  set scrollSpyId(newId: string) {
    if (newId) {
      this._scrollSpyId = newId;
    }
  }
  private _scrollSpyId: string;

  @Input() offset = 0;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private scrollSpyService: ScrollSpyService
  ) {}

  isElementInViewport() {
    const scrollTop = this.document.documentElement.scrollTop || this.document.body.scrollTop;
    const elHeight = this.el.nativeElement.offsetHeight;
    const elTop = this.el.nativeElement.offsetTop - this.offset;
    const elBottom = elTop + elHeight;

    return (scrollTop >= elTop && scrollTop <= elBottom);
  }

  updateActiveState(scrollSpyId: string, id: string) {
    if (this.isElementInViewport()) {
      this.scrollSpyService.updateActiveState(scrollSpyId, id);
    } else {
      this.scrollSpyService.removeActiveState(scrollSpyId, id);
    }
  }

  onScroll() {
    this.updateActiveState(this.scrollSpyId, this.id);
  }

  listenToScroll() {
    this.renderer.listen(window, 'scroll', () => {
      this.onScroll();
    });
  }

  ngOnInit() {
    this.id = this.el.nativeElement.id;

    this.ngZone.runOutsideAngular(this.listenToScroll.bind(this));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateActiveState(this.scrollSpyId, this.id);
    }, 0);
  }
}
