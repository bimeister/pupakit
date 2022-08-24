import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@kit/lib/components.module';
import { AnchorComponent } from './components/anchor/anchor.component';

@NgModule({
  declarations: [AnchorComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [AnchorComponent],
})
export class AnchorModule {}
