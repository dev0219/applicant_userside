import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdbStepComponent } from './step.component';
import { MdbStepperComponent } from './stepper.component';


@NgModule({
  declarations: [
    MdbStepperComponent,
    MdbStepComponent
  ],
  exports: [
    MdbStepperComponent,
    MdbStepComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class StepperModule { }
