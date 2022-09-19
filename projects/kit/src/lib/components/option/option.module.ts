import { NgModule, Type } from '@angular/core';
import { OptionComponent } from './components/option/option.component';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { SharedModule } from '../../../internal/shared/shared.module';
import { OptionTitleComponent } from './components/option-title/option-title.component';
import { OptionDescriptionComponent } from './components/option-description/option-description.component';
import { OptionActionsRightDirective } from './directives/option-actions-right.directive';
import { OptionIconComponent } from './components/option-icon/option-icon.component';
import { IconModule } from '../icon/icon.module';

const COMPONENTS: Type<unknown>[] = [
  OptionComponent,
  OptionTitleComponent,
  OptionDescriptionComponent,
  OptionIconComponent,
];

const DIRECTIVES: Type<unknown>[] = [OptionActionsRightDirective];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  exports: [...COMPONENTS, ...DIRECTIVES],
  imports: [SharedModule, CheckboxModule, IconModule],
})
export class OptionModule {}
