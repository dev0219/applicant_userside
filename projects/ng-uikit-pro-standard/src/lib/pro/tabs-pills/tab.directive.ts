import {
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  TemplateRef,
  ElementRef,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  Renderer2
} from '@angular/core';
import {TabsetComponent} from './tabset.component';
import {isPlatformBrowser} from '@angular/common';

@Directive({selector: 'mdb-tab, [mdbTab]'})
export class TabDirective implements OnInit, OnDestroy {
  @Input() public type: string;
  /** tab header text */
  @Input() public heading: string;
  /** if true tab can not be activated */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;

    if (this._disabled && this._active) {
      this.tabset.initActiveTab();
    }
  }
  private _disabled = false;
  /** if true tab can be removable, additional button will appear */
  @Input() public removable: boolean;
  /** if set, will be added to the tab's class atribute */
  @Input() public customClass: string;

  @Input() tabOrder: number;

  /** tab active state toggle */
  @Input()
  public get active(): boolean {
    return this._active;
  }

  public set active(active: boolean) {

    if (this.disabled && active || !active) {
      if (this._active && !active) {
        this.renderer.removeClass(this.el.nativeElement, 'show');
        this.renderer.removeClass(this.el.nativeElement, 'active');
        this._active = active;
        this.deselect.emit(this);
      }
      return;
    }
    this.renderer.addClass(this.el.nativeElement, 'show');
    this.renderer.addClass(this.el.nativeElement, 'active');
      this._active = active;
    this.select.emit(this);

    this.tabset.tabs.forEach((mdbTab: TabDirective) => {
      if (mdbTab !== this) {
        mdbTab.active = false;
      }
    });

  }

  /** fired when tab became active, $event:Tab equals to selected instance of Tab component */
  @Output() public select: EventEmitter<TabDirective> = new EventEmitter();
  /** fired when tab became inactive, $event:Tab equals to deselected instance of Tab component */
  @Output() public deselect: EventEmitter<TabDirective> = new EventEmitter();
  /** fired before tab will be removed */
  @Output() public removed: EventEmitter<TabDirective> = new EventEmitter();

  @HostBinding('class.tab-pane') public addClass = true;
  @HostBinding('class.fade') public test = true;


  public headingRef: TemplateRef<any>;
  public tabset: TabsetComponent;
  // public el: ElementRef = null;
  public el: ElementRef | any = null;
  thus: this;
  private _active = false;


  isBrowser: any = null;

  public constructor(
    @Inject(PLATFORM_ID) platformId: string,
    tabset: TabsetComponent, el: ElementRef,
    private renderer: Renderer2) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.el = el;
    this.tabset = tabset;
  }

  public ngOnInit(): void {
    this.removable = this.removable;
    this.tabset.addTab(this);
  }

  ngOnDestroy() {
    this.tabset.removeTab(this);
  }

}
