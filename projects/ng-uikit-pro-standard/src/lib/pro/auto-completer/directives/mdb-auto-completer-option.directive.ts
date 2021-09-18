import {Directive, ElementRef} from '@angular/core';

@Directive({selector: '[mdbAutoCompleterOption]'})
export class MdbAutoCompleterOptionDirective {
  value: string;
  constructor(private _el: ElementRef) {
    this.value = this._el.nativeElement.textContent;
  }
}
