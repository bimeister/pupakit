import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ThemeWrapperComponent } from './components/theme-wrapper/theme-wrapper.component';

@NgModule({
  declarations: [ThemeWrapperComponent],
  imports: [SharedModule],
  exports: [ThemeWrapperComponent]
})
export class ThemeWrapperModule {}
