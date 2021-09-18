import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
  forwardRef,
  AfterViewInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';

export const RANGE_VALUE_ACCESOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => MdbRangeInputComponent),
  multi: true,
};

@Component({
  selector: 'mdb-range-input',
  templateUrl: './mdb-range.component.html',
  styleUrls: ['./range-module.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [RANGE_VALUE_ACCESOR],
})
export class MdbRangeInputComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild('rangeCloud', { static: false }) rangeCloud: ElementRef;
  @ViewChild('rangeField', { static: false }) rangeField: ElementRef;

  @Input() id: string;
  @Input() required: boolean;
  @Input() name: string;
  @Input() value: string;
  @Input() disabled: boolean;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step: number;
  @Input() default: boolean;
  @Input() defaultRangeCounterClass: string;

  @Output() rangeValueChange = new EventEmitter<any>();

  range: any = 0;
  stepLength: number;
  steps: number;
  cloudRange = 0;
  visibility = false;

  @HostListener('change', ['$event']) onchange(event: any) {
    this.onChange(event.target.value);
  }

  @HostListener('input', ['$event']) oninput(event: any) {
    const value: number = +event.target.value;
    this.rangeValueChange.emit({ value: value });

    if (this.checkIfSafari()) {
      this.focusRangeInput();
    }
  }

  @HostListener('click') onclick() {
    this.focusRangeInput();
  }

  @HostListener('touchstart') onTouchStart() {
    this.focusRangeInput();
  }

  @HostListener('mouseleave') onmouseleave() {
    if (this.checkIfSafari()) {
      this.blurRangeInput();
    }
  }
  constructor(private renderer: Renderer2, private cdRef: ChangeDetectorRef) {}

  focusRangeInput() {
    this.input.nativeElement.focus();
    this.visibility = true;
  }

  blurRangeInput() {
    this.input.nativeElement.blur();
    this.visibility = false;
  }

  coverage(event: any) {
    if (typeof this.range === 'string' && this.range.length !== 0) {
      return this.range;
    }

    if (!this.default) {
      const newValue = event.target.value;
      const newRelativeGain = newValue - this.min;
      const inputWidth = this.input.nativeElement.offsetWidth;

      let thumbOffset = 0;
      const offsetAmmount = 15;
      const distanceFromMiddle = newRelativeGain - this.steps / 2;

      this.stepLength = inputWidth / this.steps;

      thumbOffset = (distanceFromMiddle / this.steps) * offsetAmmount;
      this.cloudRange = this.stepLength * newRelativeGain - thumbOffset;

      this.renderer.setStyle(this.rangeCloud.nativeElement, 'left', this.cloudRange + 'px');
    }
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

  ngAfterViewInit() {
    this.steps = this.max - this.min;

    if (this.value) {
      this.range = this.value;
      this.cdRef.detectChanges();
    }
  }

  // Control Value Accessor Methods
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
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
