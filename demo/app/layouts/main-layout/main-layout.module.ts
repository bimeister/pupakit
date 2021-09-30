import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MainLayoutComponent } from './main-layout.component';
import { NavigationModule } from '../../pages/components/navigation/navigation.module';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [CommonModule, RouterModule, NavigationModule]
})
export class MainLayoutModule {}
