import { NgModule } from '@angular/core';
import { SharedModule } from './../../../internal/shared/shared.module';
import { FloatingCardComponent } from './components/floating-card.component';

@NgModule({
  declarations: [FloatingCardComponent],
  imports: [SharedModule],
  exports: [FloatingCardComponent]
})
export class FloatingCardModule {}
