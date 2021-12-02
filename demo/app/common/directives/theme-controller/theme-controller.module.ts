import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeControllerDirective } from './theme-controller.directive';

@NgModule({
  declarations: [ThemeControllerDirective],
  imports: [CommonModule],
  exports: [ThemeControllerDirective],
})
export class ThemeControllerModule {}
