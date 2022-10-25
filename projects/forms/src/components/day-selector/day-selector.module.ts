import { NgModule } from '@angular/core';
import { DaySelectorComponent } from './components/day-selector/day-selector.component';
import { DaySelectorItemComponent } from './components/day-selector-item/day-selector-item.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DaySelectorComponent, DaySelectorItemComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [DaySelectorComponent],
})
export class PupaDaySelectorModule {}
