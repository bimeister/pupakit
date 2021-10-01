import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DemoSharedModule } from '../../shared/shared.module';
import { NavigationModule } from '../../components/navigation/navigation.module';
import { KitLayoutComponent } from './kit-layout.component';

@NgModule({
  declarations: [KitLayoutComponent],
  imports: [DemoSharedModule, RouterModule, NavigationModule]
})
export class KitLayoutModule {}
