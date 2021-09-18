import {NgModule} from '@angular/core';

import {MdbAutoCompleterComponent} from './components/mdb-auto-completer.component';
import {MdbOptionComponent} from './components/mdb-option.component';
import {MdbAutoCompleterDirective} from './directives/mdb-auto-completer.directive';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MdbAutoCompleterOptionDirective} from './directives/mdb-auto-completer-option.directive';
@NgModule({
  imports: [CommonModule, HttpClientModule, FormsModule],
  declarations: [MdbAutoCompleterComponent, MdbOptionComponent, MdbAutoCompleterDirective, MdbAutoCompleterOptionDirective],
  exports: [MdbAutoCompleterComponent, MdbOptionComponent, MdbAutoCompleterDirective, MdbAutoCompleterOptionDirective],
})
export class AutoCompleterModule {
}
