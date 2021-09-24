import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

import { KitLayoutComponent } from './kit-layout.component';

@NgModule({
  declarations: [KitLayoutComponent],
  imports: [DemoSharedModule, RouterModule]
})
export class KitLayoutModule {}
