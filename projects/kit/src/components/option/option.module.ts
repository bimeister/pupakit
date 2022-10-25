import { NgModule, Type } from '@angular/core';
import { OptionComponent } from './components/option/option.component';
import { OptionTitleComponent } from './components/option-title/option-title.component';
import { OptionDescriptionComponent } from './components/option-description/option-description.component';
import { OptionActionsRightDirective } from './directives/option-actions-right.directive';
import { OptionIconComponent } from './components/option-icon/option-icon.component';
import { CommonModule } from '@angular/common';
import { PupaCheckboxModule } from '../checkbox/checkbox.module';
import { PupaIconModule } from '../icon/icon.module';

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
  imports: [CommonModule, PupaCheckboxModule, PupaIconModule],
})
export class PupaOptionModule {}
