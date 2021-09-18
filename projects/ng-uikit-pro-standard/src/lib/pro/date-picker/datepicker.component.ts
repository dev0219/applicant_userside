import { IMyLocales } from './interfaces/locale.interface';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewEncapsulation,
  Renderer2,
  forwardRef,
  ViewChild,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  IMyDate,
  IMyDateRange,
  IMyMonth,
  IMyCalendarDay,
  IMyWeek,
  IMyDayLabels,
  IMyMonthLabels,
  IMyInputFieldChanged,
  IMyCalendarViewChanged,
  IMyInputFocusBlur,
  IMyMarkedDates,
  IMyMarkedDate,
} from './interfaces/index';
import { LocaleService } from './services/datepickerLocale.service';
import { UtilService } from './services/datepickerUtil.service';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Utils } from '../../free/utils';

export const MYDP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => MDBDatePickerComponent),
  multi: true,
};

enum CalToggle {
  Open = 1,
  CloseByDateSel = 2,
  CloseByCalBtn = 3,
  CloseByOutClick = 4,
}

enum Year {
  min = 1000,
  max = 9999,
}

enum InputFocusBlur {
  focus = 1,
  blur = 2,
}

enum KeyCode {
  enter = 13,
  space = 32,
}

enum MonthId {
  prev = 1,
  curr = 2,
  next = 3,
}

@Component({
  selector: 'mdb-date-picker',
  exportAs: 'mdbdatepicker',
  templateUrl: './datapicker.component.html',
  styleUrls: ['./date-picker-module.scss'],
  providers: [UtilService, MYDP_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MDBDatePickerComponent implements OnChanges, ControlValueAccessor, AfterViewInit {
  @Input() tabIndex: any;
  @Input() options: any;
  @Input() locale: string;
  @Input() defaultMonth: string;
  @Input() selDate: string;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() selector: number;
  @Input() disabled: boolean;
  @Input() openOnFocus = true;
  @Input() outlineInput = false;
  @Input() inline = false;
  @Input() inlineIcon = 'far fa-calendar-alt';

  @Output() dateChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() inputFieldChanged: EventEmitter<IMyInputFieldChanged> = new EventEmitter<
    IMyInputFieldChanged
  >();
  @Output() calendarViewChanged: EventEmitter<IMyCalendarViewChanged> = new EventEmitter<
    IMyCalendarViewChanged
  >();
  @Output() calendarToggle: EventEmitter<number> = new EventEmitter<number>();
  @Output() inputFocusBlur: EventEmitter<IMyInputFocusBlur> = new EventEmitter<IMyInputFocusBlur>();
  @Output() closeButtonClicked: EventEmitter<MDBDatePickerComponent> = new EventEmitter<
    MDBDatePickerComponent
  >();
  @Output() clearButtonClicked: EventEmitter<MDBDatePickerComponent> = new EventEmitter<
    MDBDatePickerComponent
  >();
  @Output() todayButtonClicked: EventEmitter<MDBDatePickerComponent> = new EventEmitter<
    MDBDatePickerComponent
  >();

  @ViewChild('divFocus', { static: false }) public divFocus: any;
  @ViewChild('pickerFrame', { static: false }) pickerFrame: ElementRef;

  public isDateSelected = false;
  public labelActive = false;
  public showSelector = false;
  public visibleMonth: IMyMonth = { monthTxt: '', monthNbr: 0, year: 1 };
  public selectedMonth: IMyMonth = { monthTxt: '', monthNbr: 0, year: 0 };
  public selectedDate: IMyDate = { year: 0, month: 0, day: 0 };
  public weekDays: Array<string> = [];
  public dates: Array<IMyWeek> = [];
  public selectionDayTxt = '';
  public invalidDate = false;
  public disableTodayBtn = false;
  public dayIdx = 0;
  public weekDayOpts: Array<string> = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

  public editMonth = false;
  public invalidMonth = false;
  public editYear = false;
  public invalidYear = false;

  public prevMonthDisabled = false;
  public nextMonthDisabled = false;
  public prevYearDisabled = false;
  public nextYearDisabled = false;

  public prevMonthId: number = MonthId.prev;
  public currMonthId: number = MonthId.curr;
  public nextMonthId: number = MonthId.next;

  isOpen = false;
  isDisabled = false;

  public tmp: IMyDate = {
    year: this.getToday().year,
    month: this.getToday().month,
    day: this.getToday().day,
  };

  // Default options
  public opts: any = {
    startDate: <any>'',
    closeAfterSelect: <boolean>false,
    dayLabelsFull: <IMyDayLabels>{},
    dayLabels: <IMyDayLabels>{},
    monthLabelsFull: <IMyMonthLabels>{},
    monthLabels: <IMyMonthLabels>{},
    dateFormat: <string>'',
    showTodayBtn: <boolean>true,
    todayBtnTxt: <string>'',
    firstDayOfWeek: <string>'',
    sunHighlight: <boolean>true,
    markCurrentDay: <boolean>true,
    disableUntil: <IMyDate>{ year: 0, month: 0, day: 0 },
    disableSince: <IMyDate>{ year: 0, month: 0, day: 0 },
    disableDays: <Array<IMyDate | number>>[],
    enableDays: <Array<IMyDate | number>>[],
    editableDateField: <boolean>true,
    markDates: <Array<IMyMarkedDates>>[],
    markWeekends: <IMyMarkedDate>{},
    disableDateRanges: <Array<IMyDateRange>>[],
    disableWeekends: <boolean>false,
    showWeekNumbers: <boolean>false,
    height: <string>'32px',
    width: <string>'100%',
    selectionTxtFontSize: <string>'1rem',
    showClearDateBtn: <boolean>true,
    alignSelectorRight: <boolean>false,
    disableHeaderButtons: <boolean>true,
    minYear: <number>Year.min,
    maxYear: <number>Year.max,
    componentDisabled: <boolean>false,
    showSelectorArrow: <boolean>true,
    ariaLabelInputField: <string>'Date input field',
    ariaLabelClearDate: <string>'Clear Date',
    ariaLabelOpenCalendar: <string>'Open Calendar',
    ariaLabelPrevMonth: <string>'Previous Month',
    ariaLabelNextMonth: <string>'Next Month',
    ariaLabelPrevYear: <string>'Previous Year',
    ariaLabelNextYear: <string>'Next Year',
  };

  public months: any = [];
  public years: any = [];
  public elementNumber: any;

  private utils: Utils = new Utils();

  firstTimeOpenedModal = true;
  modalHeightBefore: any = null;
  isMobile: any = null;
  isBrowser: any = false;

  constructor(
    public elem: ElementRef,
    private renderer: Renderer2,
    private localeService: LocaleService,
    private utilService: UtilService,
    private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }
    this.setLocaleOptions();
    renderer.listen(this.elem.nativeElement, 'click', (event: any) => {
      if (
        this.showSelector &&
        event.target &&
        this.elem.nativeElement !== event.target &&
        !this.elem.nativeElement.contains(event.target)
      ) {
        this.closeBtnClicked();
        this.calendarToggle.emit(CalToggle.CloseByOutClick);
      }
      if (event.target.classList.contains('picker__holder')) {
        this.closeBtnClicked();
        this.cdRef.detectChanges();
      }
      if (true && event.target && this.elem.nativeElement.contains(event.target)) {
        this.resetMonthYearEdit();
        this.cdRef.detectChanges();
      }
    });
  }

  ngAfterViewInit() {
    if (this.opts.startDate) {
      setTimeout(() => {
        if (this.opts.startDate.toString().indexOf('T') !== -1) {
          const index = this.opts.startDate.toString().indexOf('T');
          const startDate = this.opts.startDate.toString().substr(0, index);
          this.onUserDateInput(startDate);
        }
      }, 0);
    }
  }

  ChangeZIndex() {
    if (this.isBrowser) {
      setTimeout(() => {
        // Fix for visible date / time picker input when picker plate is visible.
        try {
          const openedPicker: any = this.document.querySelector('.picker--opened');
          const allPickers: any = this.document.querySelectorAll('.picker');
          allPickers.forEach((element: any) => {
            this.renderer.setStyle(element, 'z-index', '0');
          });
          this.renderer.setStyle(openedPicker, 'z-index', '100');
        } catch (error) {}
      }, 0);
    }
  }

  onChangeCb: (_: any) => void = () => {};
  onTouchedCb: () => void = () => {};

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.inline) {
      if (isDisabled) {
        this.inlineIcon += ' disabled grey-text';
      } else {
        const to = this.inlineIcon.indexOf('disabled');
        this.inlineIcon = this.inlineIcon.substr(0, to);
        this.cdRef.detectChanges();
      }
    }
  }

  removeInlineStyle() {
    try {
      if (this.elem.nativeElement.parentElement.parentElement.classList.contains('modal-content')) {
        this.renderer.setStyle(
          this.elem.nativeElement.parentElement.parentElement,
          'transition',
          'height 0.3s'
        );
        this.elem.nativeElement.parentElement.parentElement.style.height =
          this.modalHeightBefore + 'px';
      }
    } catch (error) {}
    setTimeout(() => {
      (this.document.documentElement as any).style.removeProperty('overflow');
    }, 155);
    this.labelActive = false;
  }

  setLocaleOptions(): void {
    const opts: any = this.localeService.getLocaleOptions(this.locale);
    Object.keys(opts).forEach(k => {
      this.opts[k] = opts[k];
    });
  }

  addLocale(locale: IMyLocales) {
    this.localeService.locales = Object.assign({}, this.localeService.locales, locale);
    setTimeout(() => {
      this.setLocaleOptions();
    }, 0);
  }

  setOptions(): void {
    const thisYear = new Date();
    const currentYear = thisYear.getFullYear();
    if (this.options !== undefined) {
      Object.keys(this.options).forEach(k => {
        this.opts[k] = this.options[k];
      });
    }
    if (this.disabled !== undefined) {
      this.opts.componentDisabled = this.disabled;
    }

    if (this.opts.minYear === 1000) {
      this.opts.minYear = currentYear - 7;
    }

    if (this.opts.maxYear === 9999) {
      this.opts.maxYear = currentYear + 7;
    }
  }

  resetMonthYearEdit(): void {
    this.editMonth = false;
    this.editYear = false;
    this.invalidMonth = false;
    this.invalidYear = false;
  }

  onUserDateInput(value: string): void {
    this.invalidDate = false;
    if (value.length === 0) {
      this.clearDate();
    } else {
      const date: IMyDate = this.utilService.isDateValid(
        value,
        this.opts.dateFormat,
        this.opts.minYear,
        this.opts.maxYear,
        this.opts.disableUntil,
        this.opts.disableSince,
        this.opts.disableWeekends,
        this.opts.disableDays,
        this.opts.disableDateRanges,
        this.opts.monthLabels,
        this.opts.enableDays
      );

      if (this.utilService.isInitializedDate(date)) {
        this.selectDate(date);
        this.setVisibleMonth();
      } else {
        this.invalidDate = true;
      }
    }
    if (this.invalidDate) {
      this.inputFieldChanged.emit({
        value: value,
        dateFormat: this.opts.dateFormat,
        valid: !(value.length === 0 || this.invalidDate),
      });
      this.onChangeCb('');
      this.onTouchedCb();
    }
  }

  onFocusInput(event: any): void {
    if (this.openOnFocus && !this.isOpen) {
      this.openBtnClicked();
    }

    this.inputFocusBlur.emit({ reason: InputFocusBlur.focus, value: event.target.value });
    (this.document.documentElement as any).style.overflow = 'hidden';
    // this.divFocus.nativeElement.focus();
  }

  onBlurInput(event: any): void {
    this.selectionDayTxt = event.target.value;
    this.onTouchedCb();
    this.inputFocusBlur.emit({ reason: InputFocusBlur.blur, value: event.target.value });
  }

  onUserMonthInput(value: string): void {
    this.invalidMonth = false;
    const m: number = this.utilService.isMonthLabelValid(value, this.opts.monthLabels);
    if (m !== -1) {
      this.editMonth = false;
      if (m !== this.visibleMonth.monthNbr) {
        this.visibleMonth = {
          monthTxt: this.monthText(m),
          monthNbr: m,
          year: this.visibleMonth.year,
        };
        this.generateCalendar(m, this.visibleMonth.year, true);
      }
    } else {
      this.invalidMonth = true;
    }
  }

  onUserYearInput(value: string): void {
    this.invalidYear = false;
    const y: number = this.utilService.isYearLabelValid(
      Number(value),
      this.opts.minYear,
      this.opts.maxYear
    );
    if (y !== -1) {
      this.editYear = false;
      if (y !== this.visibleMonth.year) {
        this.visibleMonth = {
          monthTxt: this.visibleMonth.monthTxt,
          monthNbr: this.visibleMonth.monthNbr,
          year: y,
        };
        this.generateCalendar(this.visibleMonth.monthNbr, y, true);
      }
    } else {
      this.invalidYear = true;
    }
  }

  isTodayDisabled(): void {
    this.disableTodayBtn = this.utilService.isDisabledDay(
      this.getToday(),
      this.opts.disableUntil,
      this.opts.disableSince,
      this.opts.disableWeekends,
      this.opts.disableDays,
      this.opts.disableDateRanges,
      this.opts.enableDays
    );
  }

  parseOptions(): void {
    if (this.locale) {
      this.setLocaleOptions();
    }
    this.setOptions();
    this.isTodayDisabled();
    this.dayIdx = this.weekDayOpts.indexOf(this.opts.firstDayOfWeek);
    if (this.dayIdx !== -1) {
      let idx: number = this.dayIdx;
      for (let i = 0; i < this.weekDayOpts.length; i++) {
        this.weekDays.push(this.opts.dayLabels[this.weekDayOpts[idx]]);
        idx = this.weekDayOpts[idx] === 'sa' ? 0 : idx + 1;
      }
    }
  }

  writeValue(value: any): void {
    if (value && typeof value === 'string') {
      this.updateDateValue(this.parseSelectedDate(value), false);
    } else if (value && value['date']) {
      this.updateDateValue(this.parseSelectedDate(value['date']), false);
    } else if (value === '' || value === null) {
      this.selectedDate = { year: 0, month: 0, day: 0 };
      this.selectionDayTxt = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('selector') && changes['selector'].currentValue > 0) {
      this.openBtnClicked();
    }

    if (changes.hasOwnProperty('placeholder')) {
      this.placeholder = changes['placeholder'].currentValue;
    }

    if (changes.hasOwnProperty('locale')) {
      this.locale = changes['locale'].currentValue;
      this.setLocaleOptions();
      this.updateDateValue(this.selectedDate, false);
    }

    if (changes.hasOwnProperty('disabled')) {
      this.disabled = changes['disabled'].currentValue;
    }

    if (changes.hasOwnProperty('options')) {
      this.options = changes['options'].currentValue;
      if (changes.options.currentValue.startDate) {
        this.onUserDateInput(changes.options.currentValue.startDate);
      }
    }

    this.weekDays.length = 0;
    this.parseOptions();

    if (changes.hasOwnProperty('defaultMonth')) {
      const dm: string = changes['defaultMonth'].currentValue;
      if (dm !== null && dm !== undefined && dm !== '') {
        this.selectedMonth = this.parseSelectedMonth(dm);
      } else {
        this.selectedMonth = { monthTxt: '', monthNbr: 0, year: 0 };
      }
    }

    if (changes.hasOwnProperty('selDate')) {
      const sd: any = changes['selDate'];
      if (
        sd.currentValue !== null &&
        sd.currentValue !== undefined &&
        sd.currentValue !== '' &&
        Object.keys(sd.currentValue).length !== 0
      ) {
        this.selectedDate = this.parseSelectedDate(sd.currentValue);
        setTimeout(() => {
          this.onChangeCb(this.getDateModel(this.selectedDate));
        });
        this.isDateSelected = true;
      } else {
        // Do not clear on init
        if (!sd.isFirstChange()) {
          this.clearDate();
        }
      }
    }

    if (this.showSelector) {
      this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year, false);
    }
  }

  hideKeyboard() {
    try {
      setTimeout(() => {
        const field = this.renderer.createElement('input');
        this.renderer.appendChild(this.elem.nativeElement, field);
        const inputReference = this.elem.nativeElement.lastElementChild;
        this.renderer.setAttribute(inputReference, 'type', 'text');
        this.renderer.setAttribute(inputReference, 'type', 'text');
        this.renderer.setStyle(inputReference, 'opacity', '0');
        this.renderer.setStyle(inputReference, '-webkit-user-modify', 'read-write-plaintext-only');
        field.onfocus = () => {
          setTimeout(() => {
            this.renderer.setStyle(field, 'display', 'none');
            setTimeout(() => {
              this.renderer.removeChild(this.elem.nativeElement, field);
              this.document.body.focus();
            }, 0);
          }, 0);
        };
        field.focus();
      }, 0);
    } catch (error) {}
  }

  removeBtnClicked(): void {
    this.clearDate();
    if (this.showSelector) {
      this.calendarToggle.emit(CalToggle.CloseByCalBtn);
    }
    this.isDateSelected = false;
    this.clearButtonClicked.emit(this);
    this.cdRef.markForCheck();
  }

  closeBtnClicked() {
    this.showSelector = false;
    this.removeInlineStyle();
    this.isOpen = false;
    this.closeButtonClicked.emit(this);
    this.cdRef.markForCheck();
  }

  openBtnClicked(): void {
    this.isOpen = true;
    try {
      if (this.elem.nativeElement.parentElement.parentElement.classList.contains('modal-content')) {
        if (this.firstTimeOpenedModal) {
          this.modalHeightBefore = this.elem.nativeElement.parentElement.parentElement.offsetHeight;
        }
        this.firstTimeOpenedModal = false;
        this.renderer.setStyle(
          this.elem.nativeElement.parentElement.parentElement,
          'transition',
          'height 0.3s'
        );
        // tslint:disable-next-line:max-line-length
        this.elem.nativeElement.parentElement.parentElement.style.height =
          this.modalHeightBefore + this.pickerFrame.nativeElement.offsetHeight + 'px';
      }
    } catch (error) {}
    // Open selector button clicked
    this.showSelector = !this.showSelector;
    if (this.showSelector) {
      this.setVisibleMonth();
      this.calendarToggle.emit(CalToggle.Open);
    } else {
      this.calendarToggle.emit(CalToggle.CloseByCalBtn);
    }
    if (this.isMobile) {
      this.hideKeyboard();
    }
    this.labelActive = true;
    this.ChangeZIndex();
    this.cdRef.markForCheck();
  }

  setVisibleMonth(): void {
    // Sets visible month of calendar
    let y = 0,
      m = 0;
    if (!this.utilService.isInitializedDate(this.selectedDate)) {
      if (this.selectedMonth.year === 0 && this.selectedMonth.monthNbr === 0) {
        const today: IMyDate = this.getToday();
        y = today.year;
        m = today.month;
      } else {
        y = this.selectedMonth.year;
        m = this.selectedMonth.monthNbr;
      }
    } else {
      y = this.selectedDate.year;
      m = this.selectedDate.month;
    }
    this.visibleMonth = { monthTxt: this.opts.monthLabels[m], monthNbr: m, year: y };

    // Create current month
    this.generateCalendar(m, y, true);
  }

  monthList(): void {
    this.months = [];
    for (let i = 1; i <= 12; i++) {
      this.months.push({
        index: i,
        short: this.opts.monthLabels[i],
        label: this.opts.monthLabelsFull[i],
      });
    }
  }

  yearsList(): void {
    this.years = [];

    const firstYear = this.opts.minYear;
    const lastYear = this.opts.maxYear;

    for (let i = firstYear; i <= lastYear; i++) {
      this.years.push(i);
    }
  }

  prevMonth(event?: any): void {
    // Previous month from calendar
    const d: Date = this.getDate(this.visibleMonth.year, this.visibleMonth.monthNbr, 1);
    d.setMonth(d.getMonth() - 1);

    const y: number = d.getFullYear();
    const m: number = d.getMonth() + 1;

    this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
    this.generateCalendar(m, y, true);

    // Prevents trigger (click) event when using Enter
    if (event.code === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  nextMonth(event?: any): void {
    // Next month from calendar
    const d: Date = this.getDate(this.visibleMonth.year, this.visibleMonth.monthNbr, 1);
    d.setMonth(d.getMonth() + 1);

    const y: number = d.getFullYear();
    const m: number = d.getMonth() + 1;

    this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
    this.generateCalendar(m, y, true);

    // Prevents trigger (click) event when using Enter
    if (event.code === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  prevYear(): void {
    // Previous year from calendar
    this.visibleMonth.year--;
    this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year, true);
  }

  nextYear(): void {
    // Next year from calendar
    this.visibleMonth.year++;
    this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year, true);
  }

  todayClicked(): void {
    // Today button clicked
    const today: IMyDate = this.getToday();
    if (
      !this.utilService.isDisabledDay(
        today,
        this.opts.disableUntil,
        this.opts.disableSince,
        this.opts.disableWeekends,
        this.opts.disableDays,
        this.opts.disableDateRanges,
        this.opts.enableDays
      )
    ) {
      this.selectDate(today);
    }
    if (today.year !== this.visibleMonth.year || today.month !== this.visibleMonth.monthNbr) {
      this.visibleMonth = {
        monthTxt: this.opts.monthLabels[today.month],
        monthNbr: today.month,
        year: today.year,
      };
      this.generateCalendar(today.month, today.year, true);
    }
    this.todayButtonClicked.emit(this);
  }

  cellClicked(cell: any): void {
    // Cell clicked on the calendar
    if (cell.cmo === this.prevMonthId) {
      // Previous month day
      this.prevMonth();
    } else if (cell.cmo === this.currMonthId) {
      // Current month day - if date is already selected clear it
      if (
        cell.dateObj.year === this.selectedDate.year &&
        cell.dateObj.month === this.selectedDate.month &&
        cell.dateObj.day === this.selectedDate.day
      ) {
        this.clearDate();
      } else {
        this.selectDate(cell.dateObj);
      }
    } else if (cell.cmo === this.nextMonthId) {
      // Next month day
      this.nextMonth();
    }
    this.resetMonthYearEdit();
  }

  cellKeyDown(event: any, cell: any) {
    // Cell keyboard handling
    if ((event.keyCode === KeyCode.enter || event.keyCode === KeyCode.space) && !cell.disabled) {
      event.preventDefault();
      this.cellClicked(cell);
    }
  }

  clearDate(): void {
    // Clears the date and notifies parent using callbacks and value accessor
    const date: IMyDate = { year: 0, month: 0, day: 0 };
    this.dateChanged.emit({ date: date, jsdate: null, formatted: '', epoc: 0 });
    this.onChangeCb(null);
    this.onTouchedCb();
    this.updateDateValue(date, true);
    this.tmp = {
      year: this.getToday().year,
      month: this.getToday().month,
      day: this.getToday().day,
    };
    this.setVisibleMonth();
    this.labelActive = false;
  }

  selectDate(date: IMyDate): void {
    // Date selected, notifies parent using callbacks and value accessor
    this.tmp = date;
    const dateModel: any = this.getDateModel(date);
    // this.dateChanged.emit({ previousDate: this.selectionDayTxt, actualDate: dateModel });
    this.dateChanged.emit({
      date: date,
      jsdate: this.getDate(date.year, date.month, date.day),
      previousDateFormatted: this.selectionDayTxt,
      actualDateFormatted: dateModel,
      epoc: Math.round(this.getTimeInMilliseconds(date) / 1000.0),
    });
    this.onChangeCb(dateModel);
    this.onTouchedCb();
    this.updateDateValue(date, false);
    if (this.showSelector) {
      this.calendarToggle.emit(CalToggle.CloseByDateSel);
    }
    if (this.opts.closeAfterSelect) {
      this.closeBtnClicked();
    }
    this.labelActive = true;
    // hide calendar when date was clicked
    // this.showSelector = false;
  }

  updateDateValue(date: IMyDate, clear: boolean): void {
    // Updates date values
    this.selectedDate = date;
    this.tmp = date;
    this.isDateSelected = true;
    this.selectionDayTxt = clear ? '' : this.formatDate(date);
    this.inputFieldChanged.emit({
      value: this.selectionDayTxt,
      dateFormat: this.opts.dateFormat,
      valid: !clear,
    });
    this.invalidDate = false;
    this.cdRef.markForCheck();
  }

  getDateModel(date: IMyDate): any {
    // Creates a date model object from the given parameter
    return this.formatDate(date);
  }

  preZero(val: string): string {
    // Prepend zero if smaller than 10
    return parseInt(val, 0) < 10 ? '0' + val : val;
  }

  formatDate(val: any): string {
    // Returns formatted date string, if mmm is part of dateFormat returns month as a string
    // days
    const d = val.day; // 1 - 31
    const dd = this.preZero(val.day); // 01 - 31
    const ddd = this.opts.dayLabels[this.getWeekday(val)]; // Sun-Sat
    const dddd = this.opts.dayLabelsFull[this.getWeekday(val)]; // Sunday – Saturday
    const m = val.month; // 1 - 12
    const mm = this.preZero(val.month); // 01 - 12
    const mmm = this.getMonthShort(val.month); // Jan - Dec
    const mmmm = this.getMonthFull(val.month); // January – December
    const yy = val.year.toString().length === 2 ? val.year : val.year.toString().slice(2, 4); // 00 - 99
    const yyyy = val.year;

    const toReplace = this.opts.dateFormat.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
    let formatted = '';
    toReplace.forEach((el: any) => {
      switch (el) {
        case 'dddd':
          el = el.replace(el, dddd);
          break;
        case 'ddd':
          el = el.replace(el, ddd);
          break;
        case 'dd':
          el = el.replace(el, dd);
          break;
        case 'd':
          el = el.replace(el, d);
          break;
        case 'mmmm':
          el = el.replace(el, mmmm);
          break;
        case 'mmm':
          el = el.replace(el, mmm);
          break;
        case 'mm':
          el = el.replace(el, mm);
          break;
        case 'm':
          el = el.replace(el, m);
          break;
        case 'yyyy':
          el = el.replace(el, yyyy);
          break;
        case 'yy':
          el = el.replace(el, yy);
          break;
      }
      formatted += el;
    });

    return formatted;
  }

  monthText(m: number): string {
    // Returns month as a text
    return this.opts.monthLabels[m];
  }

  weekText(m: string): string {
    // Returns month as a text
    return this.opts.dayLabelsFull[m];
  }

  getMonthShort(m: number): string {
    return this.opts.monthLabels[m];
  }

  getMonthFull(m: number): string {
    return this.opts.monthLabelsFull[m];
  }

  monthStartIdx(y: number, m: number): number {
    // Month start index
    const d = new Date();
    d.setDate(1);
    d.setMonth(m - 1);
    d.setFullYear(y);
    const idx = d.getDay() + this.sundayIdx();
    return idx >= 7 ? idx - 7 : idx;
  }

  daysInMonth(m: number, y: number): number {
    // Return number of days of current month
    return new Date(y, m, 0).getDate();
  }

  daysInPrevMonth(m: number, y: number): number {
    // Return number of days of the previous month
    const d: Date = this.getDate(y, m, 1);
    d.setMonth(d.getMonth() - 1);
    return this.daysInMonth(d.getMonth() + 1, d.getFullYear());
  }

  isCurrDay(d: number, m: number, y: number, cmo: number, today: IMyDate): boolean {
    // Check is a given date the today
    return d === today.day && m === today.month && y === today.year && cmo === this.currMonthId;
  }

  getToday(): IMyDate {
    const date: Date = new Date();
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  getTimeInMilliseconds(date: IMyDate): number {
    return this.getDate(date.year, date.month, date.day).getTime();
  }

  getWeekday(date: IMyDate): string {
    // Get weekday: su, mo, tu, we ...
    return this.weekDayOpts[this.utilService.getDayNumber(date)];
  }

  getDate(year: number, month: number, day: number): Date {
    // Creates a date object from given year, month and day
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }

  sundayIdx(): number {
    // Index of Sunday day
    return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
  }

  generateCalendar(m: number, y: number, notifyChange: boolean): void {
    this.dates.length = 0;
    const today: IMyDate = this.getToday();
    const monthStart: number = this.monthStartIdx(y, m);
    const dInThisM: number = this.daysInMonth(m, y);
    const dInPrevM: number = this.daysInPrevMonth(m, y);

    let dayNbr = 1;
    let cmo: number = this.prevMonthId;
    for (let i = 1; i < 7; i++) {
      const week: Array<IMyCalendarDay> = [];
      if (i === 1) {
        // First week
        const pm = dInPrevM - monthStart + 1;
        // Previous month
        for (let j = pm; j <= dInPrevM; j++) {
          const date: IMyDate = { year: y, month: m - 1, day: j };
          week.push({
            dateObj: date,
            cmo: cmo,
            currDay: this.isCurrDay(j, m, y, cmo, today),
            dayNbr: this.utilService.getDayNumber(date),
            disabled: this.utilService.isDisabledDay(
              date,
              this.opts.disableUntil,
              this.opts.disableSince,
              this.opts.disableWeekends,
              this.opts.disableDays,
              this.opts.disableDateRanges,
              this.opts.enableDays
            ),
            markedDate: this.utilService.isMarkedDate(
              date,
              this.opts.markDates,
              this.opts.markWeekends
            ),
          });
        }

        cmo = this.currMonthId;
        // Current month
        const daysLeft: number = 7 - week.length;
        for (let j = 0; j < daysLeft; j++) {
          const date: IMyDate = { year: y, month: m, day: dayNbr };
          week.push({
            dateObj: date,
            cmo: cmo,
            currDay: this.isCurrDay(dayNbr, m, y, cmo, today),
            dayNbr: this.utilService.getDayNumber(date),
            disabled: this.utilService.isDisabledDay(
              date,
              this.opts.disableUntil,
              this.opts.disableSince,
              this.opts.disableWeekends,
              this.opts.disableDays,
              this.opts.disableDateRanges,
              this.opts.enableDays
            ),
            markedDate: this.utilService.isMarkedDate(
              date,
              this.opts.markDates,
              this.opts.markWeekends
            ),
          });
          dayNbr++;
        }
      } else {
        // Rest of the weeks
        for (let j = 1; j < 8; j++) {
          if (dayNbr > dInThisM) {
            // Next month
            dayNbr = 1;
            cmo = this.nextMonthId;
          }
          const date: IMyDate = {
            year: y,
            month: cmo === this.currMonthId ? m : m + 1,
            day: dayNbr,
          };
          week.push({
            dateObj: date,
            cmo: cmo,
            currDay: this.isCurrDay(dayNbr, m, y, cmo, today),
            dayNbr: this.utilService.getDayNumber(date),
            disabled: this.utilService.isDisabledDay(
              date,
              this.opts.disableUntil,
              this.opts.disableSince,
              this.opts.disableWeekends,
              this.opts.disableDays,
              this.opts.disableDateRanges,
              this.opts.enableDays
            ),
            markedDate: this.utilService.isMarkedDate(
              date,
              this.opts.markDates,
              this.opts.markWeekends
            ),
          });
          dayNbr++;
        }
      }
      const weekNbr: number =
        this.opts.showWeekNumbers && this.opts.firstDayOfWeek === 'mo'
          ? this.utilService.getWeekNumber(week[0].dateObj)
          : 0;
      this.dates.push({ week: week, weekNbr: weekNbr });
    }

    this.setHeaderBtnDisabledState(m, y);

    if (notifyChange) {
      // Notify parent
      this.calendarViewChanged.emit({
        year: y,
        month: m,
        first: {
          number: 1,
          weekday: this.getWeekday({
            year: y,
            month: m,
            day: 1,
          }),
        },
        last: {
          number: dInThisM,
          weekday: this.getWeekday({
            year: y,
            month: m,
            day: dInThisM,
          }),
        },
      });
    }

    this.monthList();
    this.yearsList();
  }

  parseSelectedDate(selDate: any): IMyDate {
    // Parse selDate value - it can be string or IMyDate object

    // Removes everything from selDate if it's ISO date format to allow to use ISO date in date picker
    if (selDate.toString().indexOf('T') !== -1) {
      selDate = selDate.substr(0, selDate.indexOf('T'));
    }

    let date: IMyDate = { day: 0, month: 0, year: 0 };
    if (typeof selDate === 'string') {
      const sd: string = <string>selDate;
      const df: string = this.opts.dateFormat;

      const delimeters: Array<string> = this.utilService.getDateFormatDelimeters(df);
      const dateValue = this.utilService.getDateValue(sd, df, delimeters);
      date.year = this.utilService.getNumberByValue(dateValue[0]);

      if (df.indexOf('mmmm') !== -1) {
        date.month = this.utilService.getMonthNumberByMonthName(
          dateValue[1],
          this.opts.monthLabelsFull
        );
      } else if (df.indexOf('mmm') !== -1) {
        date.month = this.utilService.getMonthNumberByMonthName(
          dateValue[1],
          this.opts.monthLabels
        );
      } else {
        date.month = this.utilService.getNumberByValue(dateValue[1]);
      }
      date.day = this.utilService.getNumberByValue(dateValue[2]);
    } else if (typeof selDate === 'object') {
      date = selDate;
    }
    this.selectionDayTxt = this.formatDate(date);
    return date;
  }

  parseSelectedMonth(ms: string): IMyMonth {
    return this.utilService.parseDefaultMonth(ms);
  }

  setHeaderBtnDisabledState(m: number, y: number): void {
    let dpm = false;
    let dpy = false;
    let dnm = false;
    let dny = false;
    if (this.opts.disableHeaderButtons) {
      dpm = this.utilService.isMonthDisabledByDisableUntil(
        {
          year: m === 1 ? y - 1 : y,
          month: m === 1 ? 12 : m - 1,
          day: this.daysInMonth(m === 1 ? 12 : m - 1, m === 1 ? y - 1 : y),
        },
        this.opts.disableUntil
      );
      dpy = this.utilService.isMonthDisabledByDisableUntil(
        {
          year: y - 1,
          month: m,
          day: this.daysInMonth(m, y - 1),
        },
        this.opts.disableUntil
      );
      dnm = this.utilService.isMonthDisabledByDisableSince(
        {
          year: m === 12 ? y + 1 : y,
          month: m === 12 ? 1 : m + 1,
          day: 1,
        },
        this.opts.disableSince
      );
      dny = this.utilService.isMonthDisabledByDisableSince(
        { year: y + 1, month: m, day: 1 },
        this.opts.disableSince
      );
    }
    this.prevMonthDisabled = (m === 1 && y === this.opts.minYear) || dpm;
    this.prevYearDisabled = y - 1 < this.opts.minYear || dpy;
    this.nextMonthDisabled = (m === 12 && y === this.opts.maxYear) || dnm;
    this.nextYearDisabled = y + 1 > this.opts.maxYear || dny;
  }

  checkActive() {
    if (this.placeholder.length > 0) {
      return true;
    }
    if (this.labelActive) {
      return true;
    }
    if (this.isDateSelected) {
      return true;
    }
    return false;
  }

  // INLINE DATE PICKER

  public toggleInlineDatePicker() {
    if (this.isOpen) {
      this.closeBtnClicked();
    } else {
      this.openBtnClicked();
    }
  }

  @HostListener('window:click', ['$event']) onWindowClick(event: any) {
    if (
      this.isOpen &&
      this.inline &&
      !this.utils.getClosestEl(event.target, '.datepicker-inline-icon') &&
      !this.utils.getClosestEl(event.target, '.datepicker-inline-icon') &&
      !this.utils.getClosestEl(event.target, '.picker__frame') &&
      !this.utils.getClosestEl(event.target, '.mydp-date')
    ) {
      this.closeBtnClicked();
    }
  }
}
