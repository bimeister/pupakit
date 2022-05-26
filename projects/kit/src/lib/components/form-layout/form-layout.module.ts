import { NgModule, Type } from '@angular/core';
import { FormLayoutComponent } from './components/form-layout/form-layout.component';
import { FormElementsGroupComponent } from './components/form-elements-group/form-elements-group.component';
import { FormElementComponent } from './components/form-element/form-element.component';
import { SharedModule } from '../../../internal/shared/shared.module';

const EXPORT_COMPONENTS: Type<unknown>[] = [FormLayoutComponent, FormElementsGroupComponent, FormElementComponent];

@NgModule({
  declarations: EXPORT_COMPONENTS,
  imports: [SharedModule],
  exports: EXPORT_COMPONENTS,
})
export class FormLayoutModule {}
