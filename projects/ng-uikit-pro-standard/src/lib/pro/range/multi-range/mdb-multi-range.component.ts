import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const RANGE_VALUE_ACCESOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => MdbMultiRangeInputComponent),
  multi: true,
};

@Component({
  selector: 'mdb-multi-range-input',
  templateUrl: 'mdb-multi-range.component.html',
  styleUrls: ['./../range-module.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [RANGE_VALUE_ACCESOR],
})
export class MdbMultiRangeInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() id: string;
  @Input() required: boolean;
  @Input() name: string;
  @Input() value: { first: number | string; second: number | string } = { first: 0, second: 0 };
  @Input() disabled: boolean;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step: number;

  @Output() rangeValueChange = new EventEmitter<{ first: number; second: number }>();

  @ViewChild('firstInput', { static: true }) firstInput: ElementRef;
  @ViewChild('secondInput', { static: true }) secondInput: ElementRef;
  @ViewChild('firstRangeCloud', { static: true }) firstRangeCloud: ElementRef;
  @ViewChild('secondRangeCloud', { static: true }) secondRangeCloud: ElementRef;
  @ViewChild('rangeField', { static: true }) rangeField: ElementRef;

  range: any;

  steps: number;
  stepLength: number;
  firstVisibility = false;
  secondVisibility = false;
  cloudRange = 0;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.range = this.value;
  }

  ngAfterViewInit() {
    this.steps = this.max - this.min;
  }

  firstRangeInput(event: any) {
    this.rangeValueChange.emit(this.range);

    if (typeof this.range === 'object' && this.range.first === 0) {
      return this.range;
    }

    this.focusRangeInput('first');
    this.moveValueCloud(event, 'first');
  }

  secondRangeInput(event: any) {
    this.rangeValueChange.emit(this.range);

    if (typeof this.range === 'object' && this.range.second === 0) {
      return this.range;
    }

    this.focusRangeInput('second');
    this.moveValueCloud(event, 'second');
  }

  private moveValueCloud(event: any, element: string) {
    const newValue = event.target.value;
    const newRelativeGain = newValue - this.min;
    const inputWidth =
      element === 'first'
        ? this.firstInput.nativeElement.offsetWidth
        : this.secondInput.nativeElement.offsetWidth;

    let thumbOffset = 0;
    const offsetAmmount = 15;
    const distanceFromMiddle = newRelativeGain - this.steps / 2;

    this.stepLength = inputWidth / this.steps;

    thumbOffset = (distanceFromMiddle / this.steps) * offsetAmmount;
    this.cloudRange = this.stepLength * newRelativeGain - thumbOffset;

    this.renderer.setStyle(
      element === 'first'
        ? this.firstRangeCloud.nativeElement
        : this.secondRangeCloud.nativeElement,
      'left',
      this.cloudRange + 'px'
    );
  }

  focusRangeInput(element: string) {
    if (this.checkIfSafari()) {
      element === 'first'
        ? this.firstInput.nativeElement.focus()
        : this.secondInput.nativeElement.focus();
    }
    element === 'first' ? (this.firstVisibility = true) : (this.secondVisibility = true);
  }

  blurRangeInput(element: string) {
    if (this.checkIfSafari()) {
      element === 'first'
        ? this.firstInput.nativeElement.blur()
        : this.secondInput.nativeElement.blur();
    }
    element === 'first' ? (this.firstVisibility = false) : (this.secondVisibility = false);
  }

  checkIfSafari() {
    const isSafari = navigator.userAgent.indexOf('Safari') > -1;
    const isChrome = navigator.userAgent.indexOf('Chrome') > -1;
    const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
    const isOpera = navigator.userAgent.indexOf('Opera') > -1;

    if (isSafari && !isChrome && !isFirefox && !isOpera) {
      return true;
    } else {
      return false;
    }
  }

  // Control Value Accessor Methods
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
    this.range = value;
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
