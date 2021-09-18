import {
  Directive,
  OnInit,
  Input,
  HostListener,
  HostBinding,
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[mdbScrollSpyLink]'
})
export class ScrollSpyLinkDirective implements OnInit {
  @Input()
  get scrollIntoView() { return this._scrollIntoView; }
  set scrollIntoView(value: boolean) {
    this._scrollIntoView = value;
  }
  private _scrollIntoView = true;

  get section() { return this._section; }
  set section(value: HTMLElement) {
    if (value) {
      this._section = value;
    }
  }
  private _section: HTMLElement;
  private _id: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: any
  ) {}

  @Input('mdbScrollSpyLink')
  get id(): string {
    return this._id;
  }
  set id(newId: string) {
    if (newId) {
      this._id = newId;
    }
  }

  @HostBinding('class.active')
  active = false;

  @HostListener('click', [])
  onClick() {
    if (this.section && this.scrollIntoView === true) {
      this.section.scrollIntoView();
    }
  }

  detectChanges() {
    this.cdRef.detectChanges();
  }

  assignSectionToId() {
    this.section = this.document.documentElement.querySelector(`#${this.id}`);
  }

  ngOnInit() {
    this.assignSectionToId();
  }
}
