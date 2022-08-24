import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioGroupModule } from '@kit/lib/components/radio-group/radio-group.module';
import { SelectModule } from '@kit/lib/components/select/select.module';
import { SwitcherModule } from '@kit/lib/components/switcher/switcher.module';
import { AnchorModule } from '../anchor/anchor.module';
import { CodeModule } from '../code/code.module';
import { ExampleViewerConfigItemComponent } from './components/example-viewer-config-item/example-viewer-config-item.component';
import { ExampleViewerContentComponent } from './components/example-viewer-content/example-viewer-content.component';
import { ExampleViewerPropertyComponent } from './components/example-viewer-property/example-viewer-property.component';
import { ExampleViewerSectionLabelComponent } from './components/example-viewer-section-label/example-viewer-section-label.component';
import { ExampleViewerSectionComponent } from './components/example-viewer-section/example-viewer-section.component';
import { ExampleViewerComponent } from './components/example-viewer/example-viewer.component';
import { PropsFormControlDisabledComponent } from './components/props-form-control-disabled/props-form-control-disabled.component';
import { PropsFormControlValidatorsComponent } from './components/props-form-control-validators/props-form-control-validators.component';
import { PropsRadioSelectComponent } from './components/props-radio-select/props-radio-select.component';
import { PropsSelectComponent } from './components/props-select/props-select.component';
import { PropsSwitcherComponent } from './components/props-switcher/props-switcher.component';
import { ExampleViewerConfigItemDescriptionDirective } from './directives/example-viewer-config-item-description.directive';
import { ExampleViewerPropertyDescriptionDirective } from './directives/example-viewer-property-description.directive';

const EXPORTS: Type<unknown>[] = [
  ExampleViewerContentComponent,
  PropsRadioSelectComponent,
  PropsSelectComponent,
  PropsSwitcherComponent,
  ExampleViewerSectionLabelComponent,
  PropsFormControlDisabledComponent,
  PropsFormControlValidatorsComponent,
  ExampleViewerSectionComponent,
  ExampleViewerPropertyComponent,
  ExampleViewerComponent,
  ExampleViewerPropertyDescriptionDirective,
  ExampleViewerConfigItemDescriptionDirective,
  ExampleViewerConfigItemComponent,
];

const IMPORTS: (Type<unknown> | ModuleWithProviders<unknown>)[] = [
  CommonModule,
  RadioGroupModule,
  SelectModule,
  SwitcherModule,
  ReactiveFormsModule,
  CodeModule,
  AnchorModule,
];

@NgModule({
  declarations: EXPORTS,
  imports: IMPORTS,
  exports: EXPORTS,
})
export class ExampleViewerModule {}
