import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { MDBBootstrapModule } from './free/mdb-free.module';
import { MDBBootstrapModulePro } from './pro/mdb-pro.module';

export {
  MDBBootstrapModule
} from './free/mdb-free.module';

export {
  MDBBootstrapModulePro
} from './pro/mdb-pro.module';

const MODULES = [
  MDBBootstrapModule,
  MDBBootstrapModulePro
];

@NgModule({
  imports: [
    MDBBootstrapModule.forRoot(),
    MDBBootstrapModulePro.forRoot(),
  ],
  exports: MODULES,
  providers: [
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class MDBRootModules {
}

@NgModule({exports: MODULES})
export class MDBBootstrapModulesPro {
  public static forRoot(): ModuleWithProviders {
  return {ngModule: MDBRootModules};
  }
}
