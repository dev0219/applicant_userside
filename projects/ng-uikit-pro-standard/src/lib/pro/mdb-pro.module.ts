import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AnimatedCardsModule } from './animated-cards/animated-cards.module';
import { FileInputModule } from './file-input/module/mdb-uploader.module';
import { ChipsModule } from './chips/chips.module';
import { ProgressBars } from './progressbars/index';
import { TabsModule } from './tabs-pills/tabset.module';
import { SelectModule } from './material-select/select.module';
import { DatepickerModule } from './date-picker/datepicker.module';
import { TimePickerModule } from './time-picker/timepicker.module';
import { LightBoxModule } from './lightbox/light-box.module';
import { SidenavModule } from './sidenav/sidenav.module';
import { ChartSimpleModule } from './easy-charts/chart-simple.module';
import { AccordionModule } from './accordion/index';
import { StickyContentModule } from './sticky-content/sticky-content.module';
import { SmoothscrollModule } from './smoothscroll/index';
import { CharCounterModule } from './inputs/char-counter.module';
import { ScrollSpyModule } from './scroll-spy/scroll-spy.module';
import { AutoFormatModule } from './auto-format/auto-format.module';
import { RangeModule } from './range/range.module';
import { AutoCompleterModule } from './auto-completer/auto-completer.module';
import { StepperModule } from './stepper/stepper.module';

export { MdbStepperComponent, MdbStepComponent, StepperModule } from './stepper/index';

export {
  MdbAutoCompleterComponent,
  MdbOptionComponent,
  MdbAutoCompleterDirective,
  AutoCompleterModule,
  MdbAutoCompleterOptionDirective,
} from './auto-completer/index';

export { RangeModule, MdbRangeInputComponent } from './range/index';

export {
  AutoFormatModule,
  MdbDateFormatDirective,
  MdbCreditCardDirective,
  MdbCvvDirective,
} from './auto-format/index';

export {
  ScrollSpyModule,
  ScrollSpyDirective,
  ScrollSpyWindowDirective,
  ScrollSpyElementDirective,
  ScrollSpyLinkDirective,
  ScrollSpyService,
} from './scroll-spy/index';

export {
  AnimatedCardsModule,
  CardRotatingComponent,
  CardRevealComponent,
} from './animated-cards/index';

export {
  ProgressbarComponent,
  ProgressbarConfigComponent,
  ProgressbarModule,
  ProgressBars,
  ProgressDirective,
  ProgressSpinnerComponent,
  BarComponent,
} from './progressbars/index';

export { MaterialChipsComponent, ChipsModule } from './chips/index';

export {
  TabDirective,
  TabHeadingDirective,
  TabsetComponent,
  TabsetConfig,
  TabsModule,
  NgTranscludeDirective,
} from './tabs-pills/index';

export { MDBSpinningPreloader } from './preloader/preloader.service';

export {
  SelectModule,
  Diacritics,
  Option,
  OptionList,
  IOption,
  SELECT_VALUE_ACCESSOR,
  SelectComponent,
  SelectDropdownComponent,
} from './material-select/index';

export {
  MDBDatePickerComponent,
  DatepickerModule,
  IMyCalendarDay,
  IMyCalendarViewChanged,
  IMyDate,
  IMyDateModel,
  IMyDateRange,
  IMyDayLabels,
  IMyInputAutoFill,
  IMyInputFieldChanged,
  IMyInputFocusBlur,
  IMyLocales,
  IMyMarkedDate,
  IMyMarkedDates,
  IMyMonth,
  IMyMonthLabels,
  IMyOptions,
  IMyWeek,
  IMyWeekday,
  InputAutoFillDirective,
  MYDP_VALUE_ACCESSOR,
  UtilService,
  LocaleService,
  FocusDirective,
} from './date-picker/index';

export { TimePickerModule, ClockPickerComponent } from './time-picker/index';

export { LightBoxModule, ImageModalComponent } from './lightbox/index';

export { SidenavComponent, SidenavModule } from './sidenav/index';

export {
  ChartSimpleModule,
  EasyPieChartComponent,
  SimpleChartComponent,
} from './easy-charts/index';

export {
  SBItemComponent,
  SBItemBodyComponent,
  SBItemHeadComponent,
  SqueezeBoxComponent,
  AccordionModule,
} from './accordion/index';

export { MdbStickyDirective, StickyContentModule } from './sticky-content/index';

export {
  SmoothscrollModule,
  PageScrollDirective,
  PageScrollConfig,
  PageScrollingViews,
  PageScrollInstance,
  PageScrollService,
  PageScrollTarget,
  PageScrollUtilService,
  EasingLogic,
} from './smoothscroll/index';

export { CharCounterDirective, CharCounterModule } from './inputs/index';

export {
  MDBFileDropDirective,
  MDBFileSelectDirective,
  FileInputModule,
  MDBUploaderService,
  UploadFile,
  UploadOutput,
  UploadInput,
  humanizeBytes,
} from './file-input/index';

const MODULES = [
  AnimatedCardsModule,
  FileInputModule,
  ChipsModule,
  // tslint:disable-next-line: deprecation
  ProgressBars,
  TabsModule,
  SelectModule,
  DatepickerModule,
  TimePickerModule,
  LightBoxModule,
  SidenavModule,
  ChartSimpleModule,
  AccordionModule,
  StickyContentModule,
  SmoothscrollModule,
  CharCounterModule,
  ScrollSpyModule,
  AutoFormatModule,
  RangeModule,
  AutoCompleterModule,
  StepperModule,
];

@NgModule({
  imports: [
    AnimatedCardsModule.forRoot(),
    ChipsModule,
    // tslint:disable-next-line: deprecation
    ProgressBars.forRoot(),
    TabsModule.forRoot(),
    SelectModule,
    DatepickerModule,
    TimePickerModule,
    LightBoxModule,
    SidenavModule,
    ChartSimpleModule,
    AccordionModule,
    StickyContentModule,
    SmoothscrollModule.forRoot(),
    CharCounterModule.forRoot(),
    ScrollSpyModule,
    AutoFormatModule,
    RangeModule,
    AutoCompleterModule,
    StepperModule,
  ],
  exports: [MODULES],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MDBRootModulePro {}

@NgModule({ exports: [MODULES] })
export class MDBBootstrapModulePro {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: MDBRootModulePro };
  }
}
