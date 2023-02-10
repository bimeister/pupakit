import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RequiredFieldComponent } from './components/required-field/required-field.component';

@NgModule({
  declarations: [RequiredFieldComponent],
  imports: [CommonModule],
  exports: [RequiredFieldComponent],
})
export class PupaRequiredFieldModule {}
