import { NgModule } from '@angular/core';
import { IconHolderComponent } from './components/icon-holder/icon-holder.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [IconHolderComponent],
  exports: [IconHolderComponent],
  imports: [CommonModule],
})
export class PupaIconHolderModule {}
