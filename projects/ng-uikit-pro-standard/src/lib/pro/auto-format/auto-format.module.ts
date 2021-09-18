import { NgModule } from '@angular/core';
import { MdbDateFormatDirective } from './mdb-date-format.directive';
import { MdbCreditCardDirective } from './mdb-credit-card.directive';
import { MdbCvvDirective } from './mdb-cvv.directive';

@NgModule({
  declarations: [
    MdbDateFormatDirective,
    MdbCreditCardDirective,
    MdbCvvDirective
  ],
  exports: [
    MdbDateFormatDirective,
    MdbCreditCardDirective,
    MdbCvvDirective
  ]
})
export class AutoFormatModule {
}
