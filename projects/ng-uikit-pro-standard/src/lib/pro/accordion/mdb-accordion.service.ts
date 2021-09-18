import {Injectable} from '@angular/core';
import { SBItemComponent } from './components/sb-item';

@Injectable()
export class MdbAccordionService {
  private _items: SBItemComponent[] = [];
  private _multiple = false;

  addItem(item: SBItemComponent) {
    this._items.push(item);
  }

  updateItemsArray(items: SBItemComponent[]) {
    this._items = [...items];
  }

  updateMultipleState(value: boolean) {
    this._multiple = value;
  }

  didItemToggled(item: SBItemComponent) {
    // on not multiple, it will collpase the rest of items
    if (!this._multiple) {
      this._items.forEach((el: any) => {
        if (el !== item) {
          el.applyToggle(true);
        }
        if (el === item) {
          const collapsed = el.collapsed ? true : false;
          setTimeout(() => {
            el.applyToggle(collapsed);
          }, 0);
        }
      });
    }
  }

}
