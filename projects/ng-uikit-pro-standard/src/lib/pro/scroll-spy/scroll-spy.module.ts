import { NgModule } from '@angular/core';

import { ScrollSpyDirective } from './scroll-spy.directive';
import { ScrollSpyLinkDirective } from './scroll-spy-link.directive';
import { ScrollSpyWindowDirective } from './scroll-spy-window.directive';
import { ScrollSpyElementDirective } from './scroll-spy-element.directive';
import { ScrollSpyService } from './scroll-spy.service';


@NgModule({
  declarations: [
    ScrollSpyDirective,
    ScrollSpyLinkDirective,
    ScrollSpyWindowDirective,
    ScrollSpyElementDirective
  ],
  exports: [
    ScrollSpyDirective,
    ScrollSpyLinkDirective,
    ScrollSpyWindowDirective,
    ScrollSpyElementDirective
  ],
  providers: [ ScrollSpyService ]
})
export class ScrollSpyModule { }
