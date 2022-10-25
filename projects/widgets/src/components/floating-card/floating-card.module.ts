import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FloatingCardComponent } from './components/floating-card.component';

@NgModule({
  declarations: [FloatingCardComponent],
  imports: [CommonModule],
  exports: [FloatingCardComponent],
})
export class PupaFloatingCardModule {}
