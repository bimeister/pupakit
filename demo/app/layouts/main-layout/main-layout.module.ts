import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MainLayoutComponent } from './main-layout.component';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [CommonModule, RouterModule]
})
export class MainLayoutModule {}
