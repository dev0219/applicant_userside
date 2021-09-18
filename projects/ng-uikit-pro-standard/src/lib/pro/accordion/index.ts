import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SqueezeBoxComponent } from './components/squeezebox';
import { SBItemComponent } from './components/sb-item';
import { SBItemHeadComponent } from './components/sb-item.head';
import { SBItemBodyComponent } from './components/sb-item.body';

export const SQUEEZEBOX_COMPONENTS = [SqueezeBoxComponent, SBItemComponent, SBItemHeadComponent, SBItemBodyComponent];
export { SBItemComponent } from './components/sb-item';
export { SBItemHeadComponent } from './components/sb-item.head';
export { SBItemBodyComponent } from './components/sb-item.body';
export { SqueezeBoxComponent } from './components/squeezebox';
@NgModule({
  imports: [CommonModule],
  declarations: [SQUEEZEBOX_COMPONENTS],
  exports: [SQUEEZEBOX_COMPONENTS]
})
export class AccordionModule { }
