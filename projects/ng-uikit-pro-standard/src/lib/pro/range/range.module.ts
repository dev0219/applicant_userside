import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbRangeInputComponent } from './mdb-range.component';
import { NgModule } from '@angular/core';
import { MdbMultiRangeInputComponent } from './multi-range/mdb-multi-range.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [MdbRangeInputComponent, MdbMultiRangeInputComponent],
  exports: [MdbRangeInputComponent, MdbMultiRangeInputComponent],
})
export class RangeModule {}
