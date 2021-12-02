import { NgModule } from '@angular/core';
import { IconModule } from '../icon/icon.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { LabelComponent } from './label.component';

const EXPORTS: any[] = [LabelComponent];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, IconModule],
  exports: [...EXPORTS],
})
export class LabelModule {}
