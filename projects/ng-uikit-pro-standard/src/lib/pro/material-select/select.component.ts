import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
  ExistingProvider,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
  ElementRef,
  Renderer2,
  AfterViewInit,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SelectDropdownComponent } from './select-dropdown.component';
import { IOption } from './option-interface';
import { Option } from './option';
import { OptionList } from './option-list';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export const SELECT_VALUE_ACCESSOR: ExistingProvider = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => SelectComponent),
  multi: true,
};

@Component({
  selector: 'mdb-select',
  templateUrl: 'select.component.html',
  styleUrls: ['./material-select-module.scss'],
  providers: [SELECT_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements ControlValueAccessor, OnChanges, OnInit, AfterViewInit {
  @Input() options: Array<IOption>;
  @Input() public customClass = '';
  @Input() allowClear = false;
  @Input() disabled = false;
  @Input() highlightColor: string;
  @Input() highlightTextColor: string;
  @Input() highlightFirst = true;
  @Input() multiple = false;
  @Input() noFilter = 0;
  @Input() notFoundMsg = 'No results found';
  @Input() placeholder = '';
  @Input() filterPlaceholder = '';
  @Input() label = '';
  @Input() filterEnabled = false;
  @Input() filterAutocomplete = true;
  @Input() visibleOptions: number;
  @Input() optionHeight = 37;
  @Input() tabindex: number;
  @Input() enableSelectAll = true;
  @Input() appendToBody: boolean;
  @Input() selectAllLabel = 'Select all';
  @Input() outline = false;

  @Output() opened: EventEmitter<any> = new EventEmitter<any>();
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() selected: EventEmitter<IOption> = new EventEmitter<IOption>();
  @Output() deselected: EventEmitter<IOption | IOption[]> = new EventEmitter<IOption | IOption[]>();
  @Output() noOptionsFound: EventEmitter<string> = new EventEmitter<string>();
  @Output() changed = new EventEmitter();

  @ViewChild('selection', { static: true }) selectionSpan: ElementRef;
  @ViewChild('dropdown', { static: false }) dropdown: SelectDropdownComponent;
  @ViewChild('filterInput', { static: false }) filterInput: ElementRef;
  @ViewChild('clear', { static: false }) clearButton: ElementRef;

  // Angular lifecycle hooks.
  KEYS: any = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    UP: 38,
    DOWN: 40,
  };

  _value: Array<any> = [];
  optionList: OptionList;
  optionsLength: number;
  visibleOptionsDefault = 4;
  // Selection state variables.
  hasSelected = false;
  isBrowser: boolean;

  // View state variables.
  hasFocus = false;
  isOpen = false;
  isBelow = true;
  filterInputWidth = 1;
  isDisabled = false;
  placeholderView = '';
  labelActive = false;
  labelRef: HTMLElement;
  labelRefActive = false;
  dropdownAnimationDone = false;

  clearClicked = false;
  selectContainerClicked = false;

  filterHeight = 0;
  dropdownHeight: number;
  dropdownMaxHeight: number;

  // Width and position for the dropdown container.
  width: number;
  top: number;
  left: number;

  documentClickFun: Function;

  itemsBefore: Array<any> = [];

  onChange = (_: any) => {};
  onTouched = () => {};

  /** Event handlers. **/

  // Angular lifecycle hooks.
  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) platformId: string,
    private cdRef: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.placeholderView = this.placeholder;
    this.updateFilterHeight();
    this.updateDropdownHeight();
    if (this.label) {
      this.updateLabelState();
    }

    this.labelRef = this._getLabelRef();

    if (this.labelRef) {
      this.updateLabelRefState();
    }

    if (this.highlightFirst) {
      this.optionList.highlightFirst = true;
    }
  }

  private _getLabelRef(): HTMLElement {
    const selectParentEl = this.el.nativeElement.parentNode;
    const labelRef = selectParentEl.querySelector('label');
    return labelRef;
  }

  updateFilterHeight() {
    this.filterEnabled ? (this.filterHeight = 78) : (this.filterHeight = 0);
  }

  updateDropdownHeight() {
    const customContentHeight = this.dropdown
      ? this.dropdown.customContent.nativeElement.clientHeight
      : 0;

    if (this.multiple && this.enableSelectAll) {
      this.dropdownMaxHeight = this.visibleOptions
        ? this.optionHeight * (this.visibleOptions + 1) + customContentHeight
        : this.optionHeight * (this.visibleOptionsDefault + 1) + customContentHeight;

      this.dropdownHeight =
        this.optionHeight * (this.optionList.options.length + 1) + customContentHeight;
    } else {
      this.dropdownMaxHeight = this.visibleOptions
        ? this.optionHeight * this.visibleOptions + customContentHeight
        : this.optionHeight * this.visibleOptionsDefault + customContentHeight;

      this.dropdownHeight =
        this.optionHeight * this.optionList.options.length + customContentHeight;
    }
  }

  onDropdownAnimationDone() {
    this.dropdownAnimationDone = true;
  }

  onDropdownAnimationStart() {
    this.dropdownAnimationDone = false;
  }

  ngAfterViewInit() {
    this.updateState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('outline')) {
      if (changes['outline'].currentValue) {
        this.renderer.addClass(this.el.nativeElement, 'mdb-select-outline');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'mdb-select-outline');
      }
    }
    if (changes.hasOwnProperty('options')) {
      this.updateOptionsList(changes.options.currentValue);
      this.updateState();
      this.updateDropdownHeight();
      this.appendToBody ? this._updateAppendedPosition() : this.updatePosition();
      this.changed.emit({
        previousValue: changes.options.previousValue,
        currentValue: changes.options.currentValue,
      });
    }
    if (changes.hasOwnProperty('noFilter')) {
      const numOptions: number = this.optionList.options.length;
      const minNumOptions: number = changes['noFilter'].currentValue;
      this.filterEnabled = numOptions >= minNumOptions;
    }

    if (changes.hasOwnProperty('placeholder')) {
      this.updateState();
    }
  }

  isChild(elemnt: any) {
    let node = elemnt.parentNode;
    while (node != null) {
      if (node === this.el.nativeElement) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  onWindowResize() {
    this.updateWidth();
  }

  // Select container.

  onSelectContainerClick(event: any) {
    if (this.isChild(event.target)) {
      this.selectContainerClicked = true;
      this.openDropdown();

      if (this.label) {
        this.updateLabelState();
      }

      if (this.labelRef) {
        this.updateLabelRefState();
      }
    }
  }

  onSelectContainerFocus() {
    if (this.label) {
      this.labelActive = true;
    }

    if (this.labelRef) {
      this.renderer.addClass(this.labelRef, 'active');
    }
    this.openDropdown();
  }

  onSelectContainerBlur() {
    if (this.label) {
      this.updateLabelState();
    }

    if (this.labelRef) {
      this.updateLabelRefState();
    }

    if (!this.isOpen && !this.disabled) {
      this.onTouched();
    }
  }

  onSelectContainerKeydown(event: any) {
    this.handleSelectContainerKeydown(event);
  }

  // Dropdown container.

  onDropdownOptionClicked(option: Option) {
    this.multiple ? this.toggleSelectOption(option) : this.selectOption(option);
  }

  onDropdownClose(focus: any) {
    this.closeDropdown(focus);
  }

  // Single filter input.
  onSingleFilterClick() {
    this.selectContainerClicked = true;
  }

  onSingleFilterInput(term: string) {
    const hasShown: boolean = this.optionList.filter(term);
    if (this.multiple && this.enableSelectAll) {
      this.dropdownHeight = (this.optionList.filtered.length + 1) * this.optionHeight;
    } else {
      this.dropdownHeight = this.optionList.filtered.length * this.optionHeight;
    }
    if (!hasShown) {
      this.noOptionsFound.emit(term);
      this.dropdownHeight = this.optionHeight;
    }
  }

  onSingleFilterKeydown(event: any) {
    this.handleSingleFilterKeydown(event);
  }

  // Multiple filter input.

  onMultipleFilterInput(event: any) {
    if (!this.isOpen) {
      this.openDropdown();
    }
    this.updateFilterWidth();
    const term: string = event.target.value;
    const hasShown: boolean = this.optionList.filter(term);
    if (!hasShown) {
      this.noOptionsFound.emit(term);
    }
  }

  onMultipleFilterKeydown(event: any) {
    this.handleMultipleFilterKeydown(event);
  }

  // Single clear select.

  onClearSelectionClick(event: any) {
    event.preventDefault();
    this.clearClicked = true;
    this.clearSelection();
    this.placeholderView = this.placeholder;
    this.onTouched();

    if (this.label) {
      this.updateLabelState();
    }

    if (this.labelRef) {
      this.updateLabelRefState();
    }
  }

  // Multiple deselect option.

  onDeselectOptionClick(option: Option) {
    this.clearClicked = true;
    this.deselectOption(option);
  }

  /** API. **/

  // TODO fix issues with global click/key handler that closes the dropdown.
  open() {
    Promise.resolve().then(() => {
      this.openDropdown();
    });
  }

  close() {
    this.closeDropdown();
  }

  get value(): string | string[] {
    return this.multiple ? this._value : this._value[0];
  }

  set value(v: string | string[]) {
    if (typeof v === 'undefined' || v === null || v === '') {
      v = [];
    } else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      v = [v];
    } else if (!Array.isArray(v)) {
      throw new TypeError('Value must be a string or an array.');
    }

    this.optionList.value = v;
    this._value = v;
    this.updateState();
  }

  clear() {
    this.clearSelection();
  }

  select(value: string) {
    this.optionList.getOptionsByValue(value).forEach(option => {
      this.selectOption(option);
    });
  }

  /** ControlValueAccessor interface methods. **/

  writeValue(value: any) {
    this.value = value;
    this.hasSelected = true;

    if (!value && value !== 0) {
      this.hasSelected = false;
    }

    if (this.label) {
      this.updateLabelState();
    }

    if (this.labelRef) {
      this.updateLabelRefState();
    }
  }

  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.cdRef.markForCheck();
  }

  valueChanged() {
    this._value = this.optionList.value;
    this.updateState();
    this.onChange(this.value);
  }

  updateState() {
    this.placeholderView = this.placeholder;
    this.updateFilterWidth();
    this.cdRef.markForCheck();
  }

  /** Initialization. **/

  updateOptionsList(options: Array<IOption>) {
    this.optionList = new OptionList(options);
    this.optionList.value = this._value;
    this.cdRef.markForCheck();
  }

  updateLabelState() {
    if (!this.placeholder && !this.hasSelected && !this.isOpen) {
      this.labelActive = false;
    } else {
      this.labelActive = true;
    }
  }

  updateLabelRefState() {
    if (!this.placeholder && !this.hasSelected && !this.isOpen) {
      this.renderer.removeClass(this.labelRef, 'active');
    } else {
      this.renderer.addClass(this.labelRef, 'active');
    }
  }

  /** Dropdown. **/
  toggleDropdown() {
    if (!this.isDisabled) {
      this.isOpen ? this.closeDropdown(true) : this.openDropdown();
    }
  }

  openDropdown() {
    this.renderer.setStyle(this.el.nativeElement, 'z-index', '1000');
    if (!this.isOpen) {
      this.isOpen = true;

      if (this.appendToBody) {
        setTimeout(() => {
          this._appendDropdown();
        }, 0);
      }

      this.updateWidth();
      this.appendToBody ? this._updateAppendedPosition() : this.updatePosition();
      ['click', 'touchstart'].forEach((ev: string) => {
        this.documentClickFun = this.renderer.listen('document', ev, (event: any) => {
          if (
            !this.isChild(event.target) &&
            this.isOpen &&
            this.dropdownAnimationDone &&
            event.target !== this.el.nativeElement
          ) {
            this.closeDropdown();
            this.clearFilterInput();

            if (this.label) {
              this.updateLabelState();
            }

            if (this.labelRef) {
              this.updateLabelRefState();
            }
          }
        });
      });

      this.opened.emit(this);
    }

    this.cdRef.markForCheck();
  }

  closeDropdown(focus: boolean = false) {
    if (this.appendToBody && this.isOpen) {
      this.renderer.removeChild('body', this.dropdown._elementRef.nativeElement);
    }

    const container = this.el.nativeElement.lastElementChild.classList;
    this.renderer.removeStyle(this.el.nativeElement, 'z-index');
    container.remove('fadeInSelect');

    if (this.isOpen) {
      this.clearFilterInput();
      this.isOpen = false;
      if (focus) {
        this.focus();
      }
      this.closed.emit(this);
    }

    this.documentClickFun();

    this.onTouched();
    this.cdRef.markForCheck();
  }

  /** Select. **/

  selectOption(option: Option) {
    if (!option.disabled) {
      this.optionList.select(option, this.multiple);
      this.valueChanged();
      this.selected.emit(option.wrappedOption);
      this.hasSelected = true;

      if (this.label) {
        this.updateLabelState();
      }

      if (this.labelRef) {
        this.updateLabelRefState();
      }
    }
    if (!this.multiple && !option.disabled) {
      this.closeDropdown();
    }
    this.cdRef.markForCheck();
  }

  deselectOption(option: Option) {
    if (option.selected) {
      this.optionList.deselect(option);
      this.valueChanged();
      this.placeholderView = this.placeholder;

      if (this.optionList.selection.length === 0) {
        this.hasSelected = false;

        if (this.label) {
          this.updateLabelState();
        }

        if (this.labelRef) {
          this.updateLabelRefState();
        }
      }
      this.deselected.emit(option.wrappedOption);
    }
  }

  clearSelection() {
    const selection: Array<Option> = this.optionList.selection;
    if (selection.length > 0) {
      this.optionList.clearSelection();
      this.valueChanged();
      this.hasSelected = false;

      if (selection.length === 1) {
        this.deselected.emit(selection[0].wrappedOption);
      } else {
        this.deselected.emit(
          selection.map(option => {
            return option.wrappedOption;
          })
        );
      }
    }
  }

  toggleSelectOption(option: Option) {
    option.selected ? this.deselectOption(option) : this.selectOption(option);
  }

  selectHighlightedOption() {
    const option: Option = this.optionList.highlightedOption;
    if (this.multiple && option !== null) {
      this.toggleSelectOption(option);
    }
    if (!this.multiple && option !== null) {
      this.selectOption(option);
      this.closeDropdown(true);
    }
  }

  deselectLast() {
    const sel: Array<Option> = this.optionList.selection;

    if (sel.length > 0) {
      const option: Option = sel[sel.length - 1];
      this.deselectOption(option);
      this.setMultipleFilterInput(option.label + ' ');
    }
  }

  onSelectAll(isSelected: boolean) {
    if (isSelected) {
      this.optionList.filtered
        .filter(option => !option.disabled)
        .forEach(option => {
          this.selectOption(option);
        });
    } else {
      this.optionList.filtered
        .filter(option => !option.disabled)
        .forEach(option => {
          this.deselectOption(option);
        });
    }
  }

  /** Filter. **/

  clearFilterInput() {
    this.dropdown.clearFilterInput();
    this.updateDropdownHeight();
  }

  setMultipleFilterInput(value: string) {
    if (this.filterEnabled) {
      this.filterInput.nativeElement.value = value;
    }
  }

  handleSelectContainerKeydown(event: any) {
    const key = event.keyCode;

    if (this.isOpen) {
      if (key === this.KEYS.ESC || (key === this.KEYS.UP && event.altKey)) {
        event.preventDefault();
        this.closeDropdown(true);

        if (this.label) {
          this.updateLabelState();
        }

        if (this.labelRef) {
          this.updateLabelRefState();
        }
      } else if (key === this.KEYS.TAB) {
        this.closeDropdown();
      } else if (key === this.KEYS.ENTER) {
        this.selectHighlightedOption();
        if (this.multiple && this.enableSelectAll) {
          this.dropdown.updateSelectAllState();
        }
      } else if (key === this.KEYS.UP) {
        event.preventDefault();
        this.optionList.highlightPreviousOption();
        this.dropdown.moveHighlightedIntoView();
      } else if (key === this.KEYS.DOWN) {
        event.preventDefault();
        this.optionList.highlightNextOption();
        this.dropdown.moveHighlightedIntoView();
      }
    } else {
      if (
        key === this.KEYS.ENTER ||
        key === this.KEYS.SPACE ||
        (key === this.KEYS.DOWN && event.altKey)
      ) {
        event.preventDefault();
        this.openDropdown();
      }
    }
  }

  handleMultipleFilterKeydown(event: any) {
    const key = event.which;

    if (key === this.KEYS.BACKSPACE) {
      if (this.hasSelected && this.filterEnabled && this.filterInput.nativeElement.value === '') {
        this.deselectLast();
      }
    }
  }

  handleSingleFilterKeydown(event: any) {
    const key = event.which;

    if (
      key === this.KEYS.ESC ||
      key === this.KEYS.TAB ||
      key === this.KEYS.UP ||
      key === this.KEYS.DOWN ||
      key === this.KEYS.ENTER
    ) {
      this.handleSelectContainerKeydown(event);
    }
  }

  /** View. **/

  focus() {
    this.hasFocus = true;
    try {
      if (this.filterEnabled) {
        this.filterInput.nativeElement.focus();
      } else {
        this.selectionSpan.nativeElement.focus();
      }
    } catch (error) {}
  }

  blur() {
    this.hasFocus = false;
    this.selectionSpan.nativeElement.blur();
  }

  updateWidth() {
    this.width = this.selectionSpan.nativeElement.offsetWidth;
  }

  updatePosition() {
    setTimeout(() => {
      const docEl: any = document.documentElement;
      let elPosition = 0;
      if (this.isBrowser) {
        elPosition =
          this.el.nativeElement.getBoundingClientRect().bottom +
          this.document.documentElement.scrollTop;
      }
      const selectSpan = this.selectionSpan.nativeElement;
      this.left = selectSpan.offsetLeft;
      const bottom: any = docEl.scrollTop + docEl.clientHeight;
      const dropdownHeight =
        this.dropdownMaxHeight > this.dropdownHeight ? this.dropdownHeight : this.dropdownMaxHeight;
      this.updateDropdownHeight();
      if (elPosition + dropdownHeight >= bottom) {
        this.top = selectSpan.offsetHeight - dropdownHeight - this.filterHeight;
      } else {
        this.top = 0;
      }
      this.cdRef.markForCheck();
    }, 0);
  }

  private _updateAppendedPosition() {
    if (this.isBrowser) {
      const selectRect: ClientRect = this.el.nativeElement.getBoundingClientRect();
      const scrollTop = this.document.documentElement.scrollTop || this.document.body.scrollTop;
      const offsetTop = selectRect.top + scrollTop;
      const height = selectRect.height;
      const dropdownHeight =
        this.dropdownMaxHeight > this.dropdownHeight ? this.dropdownHeight : this.dropdownMaxHeight;

      this.left = selectRect.left;
      if (
        offsetTop + dropdownHeight + this.filterHeight >
        scrollTop + this.document.documentElement.clientHeight
      ) {
        this.top = offsetTop - dropdownHeight + height - this.filterHeight;
      } else {
        this.top = offsetTop;
      }
    }
  }

  private _appendDropdown() {
    if (this.isBrowser) {
      const body = this.document.querySelector('body');
      const dropdown = this.dropdown._elementRef.nativeElement;

      if (body) {
        this.renderer.appendChild(body, dropdown);
      }
    }
  }

  updateFilterWidth() {
    if (typeof this.filterInput !== 'undefined') {
      const value: string = this.filterInput.nativeElement.value;
      this.filterInputWidth =
        value.length === 0 ? 1 + this.placeholderView.length * 10 : 1 + value.length * 10;
    }
  }
}
