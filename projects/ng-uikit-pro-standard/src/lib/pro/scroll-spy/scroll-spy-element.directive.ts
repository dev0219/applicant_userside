import {
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  NgZone,
  Input,
  AfterViewInit
} from '@angular/core';
import { ScrollSpyService } from './scroll-spy.service';

@Directive({
  selector: '[mdbScrollSpyElement]'
})
export class ScrollSpyElementDirective implements OnInit, AfterViewInit {
  private id: string;

  @Input('mdbScrollSpyElement')
  get scrollSpyId(): string { return this._scrollSpyId; }
  set scrollSpyId(newId: string) {
    if (newId) {
      this._scrollSpyId = newId;
    }
  }
  private _scrollSpyId: string;

  @Input() offset = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private scrollSpyService: ScrollSpyService
  ) {}

  isElementInViewport() {
    const scrollTop = this.el.nativeElement.parentElement.scrollTop;
    const elTop = this.el.nativeElement.offsetTop - this.offset;
    const elHeight = this.el.nativeElement.offsetHeight;

    return (scrollTop >= elTop && scrollTop < elTop + elHeight);
  }

  updateActiveState(scrollSpyId: string, id: string) {
    if (this.isElementInViewport()) {
      this.scrollSpyService.removeActiveLinks(scrollSpyId);
      this.scrollSpyService.updateActiveState(scrollSpyId, id);
    }
  }

  onScroll() {
    this.updateActiveState(this.scrollSpyId, this.id);
  }

  listenToScroll() {
    this.renderer.listen(this.el.nativeElement.parentElement, 'scroll', () => {
      this.onScroll();
    });
  }

  ngOnInit() {
    this.id = this.el.nativeElement.id;
    this.renderer.setStyle(this.el.nativeElement.parentElement, 'position', 'relative');

    this.ngZone.runOutsideAngular(this.listenToScroll.bind(this));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateActiveState(this.scrollSpyId, this.id);
    }, 0);
  }
}
