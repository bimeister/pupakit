import { NgModule, Type } from '@angular/core';
import { PupaAlertModule } from './components/alert/alert.module';
import { PupaDrawerModule } from './components/drawer/drawer.module';
import { PupaModalModule } from './components/modal/modal.module';
import { PupaPopoverModule } from './components/popover/popover.module';
import { PupaToastModule } from './components/toast/toast.module';

const MODULES: Type<unknown>[] = [
  PupaModalModule,
  PupaDrawerModule,
  PupaPopoverModule,
  PupaToastModule,
  PupaAlertModule,
];

@NgModule({
  declarations: [],
  imports: MODULES,
  exports: MODULES,
})
export class PupaOverlaysModule {}
