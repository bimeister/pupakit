import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwitcherComponent } from './components/switcher/switcher.component';

@NgModule({
  declarations: [SwitcherComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [SwitcherComponent],
})
export class PupaSwitcherModule {}
