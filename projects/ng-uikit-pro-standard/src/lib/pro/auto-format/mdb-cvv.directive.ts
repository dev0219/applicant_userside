import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[mdbCvv]',
})
export class MdbCvvDirective {

  @HostBinding('attr.maxLength') maxLength = '4';

  @HostListener('input', ['$event'])
  onInput(event: any) {
    this.formatInput(event);
  }

  formatInput(event: any) {
    const input = event.target.value;
    const newValue = this.getFormattedValue(input);
    event.target.value = newValue;
  }

  getFormattedValue(value: string) {
    value = this.removeNonDigits(value);
    return value;
  }

  removeNonDigits(value: string) {
    return value.replace(/\D/g, '');
  }
}
