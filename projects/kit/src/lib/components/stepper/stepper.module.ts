import { NgModule, Type } from '@angular/core';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { StepperContainerComponent } from './components/stepper-container/stepper-container.component';
import { StepperContentComponent } from './components/stepper-content/stepper-content.component';
import { StepperCounterComponent } from './components/stepper-counter/stepper-counter.component';
import { StepperItemComponent } from './components/stepper-item/stepper-item.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { StepperItemContentDirective } from './directives/stepper-item-content.directive';

const COMPONENTS: Type<unknown>[] = [
  StepperComponent,
  StepperContainerComponent,
  StepperContentComponent,
  StepperItemComponent,
  StepperCounterComponent,
];

const DIRECTIVES: Type<unknown>[] = [StepperItemContentDirective];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [SharedModule, ScrollableModule],
  exports: [...COMPONENTS, ...DIRECTIVES],
})
export class StepperModule {}
