import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from './select.component';
import { SelectDropdownComponent } from './select-dropdown.component';

export { IOption } from './option-interface';
export { SELECT_VALUE_ACCESSOR, SelectComponent } from './select.component';

@NgModule({
  declarations: [
    SelectComponent,
    SelectDropdownComponent
  ],
  exports: [
    SelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SelectModule { }
