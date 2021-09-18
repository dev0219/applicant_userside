import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SimpleChartComponent } from './chart-simple.component';
import { EasyPieChartComponent } from './chart-smallpie.component';

@NgModule({
  declarations: [
  SimpleChartComponent, EasyPieChartComponent
  ],
  exports: [
   SimpleChartComponent, EasyPieChartComponent
  ],
  imports: [CommonModule]
})
export class ChartSimpleModule {
}
