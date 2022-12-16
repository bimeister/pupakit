import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { appCheckboxMinusIcon, appExceptionsCheck10Icon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { CheckboxComponent } from './components/checkbox/checkbox.component';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PupaIconsModule.forFeature([appExceptionsCheck10Icon, appCheckboxMinusIcon]),
  ],
  exports: [CheckboxComponent],
})
export class PupaCheckboxModule {}
