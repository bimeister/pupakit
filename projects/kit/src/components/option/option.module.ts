import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaCheckboxModule } from '../checkbox/checkbox.module';
import { OptionDescriptionComponent } from './components/option-description/option-description.component';
import { OptionIconComponent } from './components/option-icon/option-icon.component';
import { OptionTitleComponent } from './components/option-title/option-title.component';
import { OptionComponent } from './components/option/option.component';
import { OptionActionsRightDirective } from './directives/option-actions-right.directive';

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
  imports: [CommonModule, PupaCheckboxModule, PupaIconsModule],
})
export class PupaOptionModule {}
