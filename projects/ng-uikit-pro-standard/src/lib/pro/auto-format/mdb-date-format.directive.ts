import { Directive, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[mdbDateFormat]',
})
export class MdbDateFormatDirective implements OnInit {
  resultLength: number;
  separatorsNumber: number;

  @Input() separator = '/';
  @Input() format = ['dd', 'mm', 'yyyy'];

  @HostListener('input', ['$event'])
  @HostListener('paste', ['$event'])
  onInput(event: any) {
    const currentValue = event.target.value;
    const newValue = this.getFormattedDate(currentValue);
    event.target.value = newValue;
  }

  ngOnInit() {
    this.setSeparatorsNumber();
    this.setResultLength();
  }

  setSeparatorsNumber() {
    this.separatorsNumber = this.format.length - 1;
  }

  setResultLength() {
    let resLength = 0;
    this.format.forEach( (value) => {
      resLength += value.length;
    });
    this.resultLength = resLength + this.separatorsNumber;
  }

  getFormattedDate(date: string) {
    const dateParts = this.getDateParts(date);

    const result = dateParts.map( (part, index) => {
      return part = this.formatDateParts(part, index);
    });

    return result.join(this.separator).slice(0, this.resultLength);
  }

  getDateParts(date: string): string[] {
    date = this.getDigits(date).slice(0, this.resultLength - this.separatorsNumber);
    const parts: string[] = [];
    const partsIndex = {
      first: this.format[0].length,
      mid: this.format[0].length + this.format[1].length,
      last: this.resultLength
    };

    parts[0] = date.slice(0, partsIndex.first);

    if (date.length > partsIndex.first) {
      parts[1] = date.slice(partsIndex.first, partsIndex.mid);
    }

    if (date.length > partsIndex.mid) {
      parts[2] = date.slice(partsIndex.mid, partsIndex.last);
    }

    return parts;
  }

  getDigits(value: string) {
    return value.replace(/\D/g, '');
  }

  formatDateParts(datePart: any, index: number) {
    switch (this.format[index]) {
      case 'dd':
        datePart = this.getFormattedDay(datePart);
        break;

      case 'mm':
        datePart = this.getFormattedMonth(datePart);
        break;
    }

    return datePart;
  }

  getFormattedDay(value: string) {
    const dayFirstNum = parseInt(value.charAt(0), 10);
    if (value) {
      if (dayFirstNum > 3 && dayFirstNum !== 0) {
        return '0' + value.charAt(0);
      } else {
        return value;
      }
    }
  }

  getFormattedMonth(value: string) {
    const monthFirstNum = parseInt(value.charAt(0), 10);
    const monthNum = parseInt(value, 10);

    if (value) {
      if (monthFirstNum > 1 && monthFirstNum !== 0) {
        return '0' + value.charAt(0);
      } else if (monthNum > 12) {
        return '12';
      } else {
        return value;
      }
    }
  }
}
