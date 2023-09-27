import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PupaDirectivesModule } from '@bimeister/pupakit.common';
import { RadioControlComponent } from './components/radio-control/radio-control.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { RadioImageControlComponent } from './components/radio-image-control/radio-image-control.component';
import { RadioImageDirective } from './directives/radio-image.directive';
import { RadioIconDirective } from './directives/radio-icon.directive';

const COMPONENTS: Type<unknown>[] = [RadioGroupComponent, RadioControlComponent, RadioImageControlComponent];

const DIRECTIVES: Type<unknown>[] = [RadioImageDirective, RadioIconDirective];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PupaDirectivesModule],
  exports: [...COMPONENTS, ...DIRECTIVES],
})
export class PupaRadioGroupModule {}
