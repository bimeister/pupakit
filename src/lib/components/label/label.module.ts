import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { IconModule } from '../icon/icon.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { LabelComponent } from './label.component';

const EXPORTS: any[] = [LabelComponent];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, TooltipModule, IconModule, NgxMaskModule.forRoot()],
  exports: [...EXPORTS]
})
export class LabelModule {}
