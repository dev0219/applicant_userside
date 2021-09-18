import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ClockPickerComponent } from './timepicker.component';
import { ButtonsModule } from '../../free/buttons/buttons.module';
import { WavesModule } from '../../free/waves/waves.module';

@NgModule({
  imports: [CommonModule, FormsModule, ButtonsModule.forRoot(), WavesModule.forRoot()],
  declarations: [ClockPickerComponent],
  exports: [ClockPickerComponent],
})
export class TimePickerModule {}
