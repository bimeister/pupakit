import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';

@NgModule({
  declarations: [ProgressBarComponent],
  imports: [SharedModule],
  exports: [ProgressBarComponent],
})
export class ProgressBarModule {}
