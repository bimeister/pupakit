import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { DropdownDirective } from '../../components/dropdown/directives/dropdown.directive';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { DropdownContainerComponent } from './components/dropdown-container/dropdown-container.component';
import { DropdownTemplateComponent } from './components/dropdown-template/dropdown-template.component';

@NgModule({
  declarations: [DropdownContainerComponent, DropdownTemplateComponent, DropdownDirective],
  imports: [SharedModule, OverlayModule, PortalModule, ThemeWrapperModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DropdownDirective],
})
export class DropdownModule {}
