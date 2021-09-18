import { Component, ElementRef, Input, HostListener } from '@angular/core';
import { ISelectedOption } from '../interfaces/selected-option.interface';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'mdb-option',
  templateUrl: 'mdb-option.component.html',
})
export class MdbOptionComponent {
  @Input() value: string;
  clicked = false;
  selectedItem: ISelectedOption;

  clickSource: Subject<MdbOptionComponent> = new Subject<MdbOptionComponent>();
  click$: Observable<MdbOptionComponent> = this.clickSource.asObservable();

  constructor(public el: ElementRef) {
    this.clicked = false;
  }

  @HostListener('click')
  onClick() {
    this.clickSource.next(this);
  }

  get label() {
    return this.el.nativeElement.textContent;
  }
}
