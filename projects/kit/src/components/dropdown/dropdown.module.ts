import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DropdownDirective } from '../../components/dropdown/directives/dropdown.directive';
import { PupaThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { DropdownContainerComponent } from './components/dropdown-container/dropdown-container.component';
import { DropdownTemplateComponent } from './components/dropdown-template/dropdown-template.component';
import { DropdownTemplateDirective } from './directives/dropdown-template.directive';

@NgModule({
  declarations: [DropdownContainerComponent, DropdownTemplateComponent, DropdownDirective, DropdownTemplateDirective],
  imports: [CommonModule, OverlayModule, PortalModule, PupaThemeWrapperModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DropdownDirective, DropdownTemplateDirective],
})
export class PupaDropdownModule {}
