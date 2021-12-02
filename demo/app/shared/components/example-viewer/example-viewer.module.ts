import { NgModule } from '@angular/core';
import { ExampleViewerComponent } from './example-viewer.component';
import { PropsRadioSelectComponent } from './props-radio-select/props-radio-select.component';
import { CommonModule } from '@angular/common';
import { ExampleViewerContentComponent } from './example-viewer-content/example-viewer-content.component';
import { ExampleViewerPropertiesComponent } from './example-viewer-properties/example-viewer-properties.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PropsCheckboxComponent } from './props-checkbox/props-checkbox.component';
import { PropsGroupLabelComponent } from './props-group-label/props-group-label.component';
import { PropsFormControlDisabledComponent } from './props-form-control-disabled/props-form-control-disabled.component';
import { PropsFormControlValidatorsComponent } from './props-form-control-validators/props-form-control-validators.component';
import { RadioGroupModule } from '../../../../../src/lib/components/radio-group/radio-group.module';

@NgModule({
  declarations: [
    ExampleViewerComponent,
    ExampleViewerContentComponent,
    ExampleViewerPropertiesComponent,
    PropsRadioSelectComponent,
    PropsCheckboxComponent,
    PropsGroupLabelComponent,
    PropsFormControlDisabledComponent,
    PropsFormControlValidatorsComponent,
  ],
  imports: [CommonModule, RadioGroupModule, ReactiveFormsModule],
  exports: [
    ExampleViewerComponent,
    ExampleViewerContentComponent,
    ExampleViewerPropertiesComponent,
    PropsRadioSelectComponent,
    PropsCheckboxComponent,
    PropsGroupLabelComponent,
    PropsFormControlDisabledComponent,
    PropsFormControlValidatorsComponent,
  ],
})
export class ExampleViewerModule {}
