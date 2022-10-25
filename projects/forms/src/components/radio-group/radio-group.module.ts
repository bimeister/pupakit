import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PupaDirectivesModule } from '@bimeister/pupakit.common';

import { RadioControlComponent } from './components/radio-control/radio-control.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';

@NgModule({
  declarations: [RadioGroupComponent, RadioControlComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PupaDirectivesModule],
  exports: [RadioGroupComponent, RadioControlComponent],
})
export class PupaRadioGroupModule {}
