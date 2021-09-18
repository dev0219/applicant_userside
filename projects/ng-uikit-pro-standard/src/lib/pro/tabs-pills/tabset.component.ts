import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';

import { TabDirective } from './tab.directive';
import { TabsetConfig } from './tabset.config';

import { WavesDirective } from '../../free/waves/waves-effect.directive';
import { isPlatformBrowser } from '@angular/common';

// todo: add active event to tab
@Component({
  selector: 'mdb-tabset',
  templateUrl: 'tabset.component.html',
  styleUrls: ['./tabs-pills-module.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [WavesDirective],
})
export class TabsetComponent implements OnDestroy, OnInit, AfterViewInit {
  public tabs: TabDirective[] = [];
  public classMap: any = {};

  protected isDestroyed: boolean;
  protected _vertical: boolean;
  protected _justified: boolean;
  protected _type: string;

  public listGetClass: String;
  public tabsGetClass: String;

  isBrowser: any = null;
  @HostBinding('class.tab-container') public clazz = true;

  @Input() disableWaves = false;
  @Input() buttonClass: String;
  @Input() contentClass: String;
  @Input() tabsButtonsClass: string;
  @Input() tabsContentClass: string;

  @ViewChild('itemsList', { static: true }) itemsList: ElementRef;
  @ViewChildren('tabEl', { read: ElementRef }) tabEl: any;

  @Output()
  showBsTab: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  shownBsTab: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  hideBsTab: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  hiddenBsTab: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  getActiveTab: EventEmitter<any> = new EventEmitter<any>();

  /** if true tabs will be placed vertically */
  @Input()
  public get vertical(): boolean {
    return this._vertical;
  }

  public set vertical(value: boolean) {
    this._vertical = value;
    this.setClassMap();
  }

  public setActiveTab(index: number): void {
    if (this.tabs[index - 1].type !== 'content') {
      this.tabs[index - 1].active = true;
      this.getActiveTab.emit({
        el: this.tabs[index - 1],
        activeTabIndex: index - 1,
      });

      this.cdRef.detectChanges();
    } else {
      this.tabs[index - 1].select.emit(this.tabs[index - 1]);
    }
  }

  /** if true tabs fill the container and have a consistent width */
  @Input()
  public get justified(): boolean {
    return this._justified;
  }

  public set justified(value: boolean) {
    this._justified = value;
    this.setClassMap();
  }

  /** navigation context class: 'tabs' or 'pills' */
  @Input()
  public get type(): string {
    return this._type;
  }

  public set type(value: string) {
    this._type = value;
    this.setClassMap();
  }

  public constructor(
    @Inject(PLATFORM_ID) platformId: string,
    config: TabsetConfig,
    public ripple: WavesDirective,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    Object.assign(this, config);
  }

  public click(event: any, index: any) {
    const prev = this.tabEl.toArray()[this.getActive()];
    const clicked = this.tabEl.toArray()[index];

    this.hideBsTab.emit({
      target: clicked,
      relatedTarget: prev,
    });
    this.showBsTab.emit({
      target: clicked,
      relatedTarget: prev,
    });

    this.setActiveTab(index + 1);

    if (this.contentClass !== 'vertical' && !this.disableWaves) {
      this.ripple.el = clicked;
      this.ripple.click(event);
    }

    this.hiddenBsTab.emit({
      target: clicked,
      relatedTarget: prev,
    });
    this.shownBsTab.emit({
      target: clicked,
      relatedTarget: prev,
    });
  }

  public ngOnDestroy(): void {
    this.isDestroyed = true;
  }

  // public getActive() {
  public getActive(): any {
    const tabs = this.tabs.map((object, index) => {
      return {
        index: index,
        object: object,
      };
    });

    for (const tab of tabs) {
      if (tab.object.active) {
        return tab.index;
      }
    }
  }

  public addTab(tab: TabDirective): void {
    const insertPos = this.tabs.findIndex(aTab => aTab.tabOrder > tab.tabOrder);
    if (insertPos >= 0) {
      this.tabs.splice(insertPos, 0, tab);
    } else {
      this.tabs.push(tab);
    }
    tab.active = this.tabs.length === 1 && tab.active !== false;
  }

  public removeTab(tab: TabDirective): void {
    const index = this.tabs.indexOf(tab);
    if (index === -1 || this.isDestroyed) {
      return;
    }
    // Select a new tab if the tab to be removed is selected and not destroyed
    if (tab.active && this.hasAvailableTabs(index)) {
      const newActiveIndex = this.getClosestTabIndex(index);
      this.tabs[newActiveIndex].active = true;
    }

    tab.removed.emit(tab);
    this.tabs.splice(index, 1);
  }

  protected getClosestTabIndex(index: number): number {
    const tabsLength = this.tabs.length;
    if (!tabsLength) {
      return -1;
    }

    for (let step = 1; step <= tabsLength; step += 1) {
      const prevIndex = index - step;
      const nextIndex = index + step;
      if (this.tabs[prevIndex] && !this.tabs[prevIndex].disabled) {
        return prevIndex;
      }
      if (this.tabs[nextIndex] && !this.tabs[nextIndex].disabled) {
        return nextIndex;
      }
    }
    return -1;
  }

  protected hasAvailableTabs(index: number): boolean {
    const tabsLength = this.tabs.length;
    if (!tabsLength) {
      return false;
    }

    for (let i = 0; i < tabsLength; i += 1) {
      if (!this.tabs[i].disabled && i !== index) {
        return true;
      }
    }
    return false;
  }

  protected setClassMap(): void {
    this.classMap = {
      'nav-stacked': this.vertical,
      'nav-justified': this.justified,
      // [`nav-${this.type}`]: true
    };
  }

  public listGet() {
    if (this.vertical) {
      this.listGetClass = this.tabsButtonsClass ? this.tabsButtonsClass : 'col-md-3';
    } else {
      this.listGetClass = this.tabsButtonsClass ? this.tabsButtonsClass : 'col-md-12';
    }
  }

  public tabsGet() {
    if (this.vertical) {
      this.tabsGetClass = this.tabsContentClass ? this.tabsContentClass : 'col-md-9';
    } else {
      this.tabsGetClass = this.tabsContentClass ? this.tabsContentClass : 'col-md-12';
    }
  }

  public getActiveElement(): any {
    const tabs = this.tabs.map((object, index) => {
      return {
        index: index,
        object: object,
      };
    });

    for (const tab of tabs) {
      if (tab.object.active) {
        return {
          el: tab.object,
          activeTabIndex: tab.index,
        };
      }
    }
  }

  public showActiveIndex() {
    const activeElement = this.getActiveElement();
    this.getActiveTab.emit(activeElement);
  }

  private getFirstActiveTabIndex() {
    const activeTabs = this.tabs.filter(tab => {
      return !tab.disabled;
    });
    return this.tabs.indexOf(activeTabs[0]);
  }

  private removeActiveTabs() {
    this.tabs.forEach(tab => {
      tab.active = false;
    });
  }

  initActiveTab() {
    const index = this.getFirstActiveTabIndex();
    if (index === -1) {
      this.removeActiveTabs();
      return;
    }
    this.setActiveTab(index + 1);
  }

  ngOnInit() {
    this.listGet();
    this.tabsGet();
    this.showActiveIndex();
  }

  ngAfterViewInit() {
    this.initActiveTab();

    if (this.tabs.findIndex(el => el.type === 'content') !== -1) {
      const spacer = this.renderer.createElement('li');
      const firstContentTypeItemIndex = this.tabs.findIndex(el => el.type === 'content');

      this.renderer.addClass(spacer, 'nav-item');
      this.renderer.addClass(spacer, 'flex-fill');
      this.renderer.insertBefore(
        this.itemsList.nativeElement,
        spacer,
        this.itemsList.nativeElement.children[firstContentTypeItemIndex]
      );
    }
  }
}
