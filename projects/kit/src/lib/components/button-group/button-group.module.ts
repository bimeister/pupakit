import { NgModule, Type } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { ButtonGroupContainerComponent } from './components/button-group-container/button-group-container.component';
import { ButtonGroupContentComponent } from './components/button-group-content/button-group-content.component';
import { ButtonGroupItemComponent } from './components/button-group-item/button-group-item.component';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { ButtonGroupItemContentTemplateDirective } from './directives/button-group-item-content-template.directive';

const COMPONENTS: Type<unknown>[] = [
  ButtonGroupComponent,
  ButtonGroupItemComponent,
  ButtonGroupContainerComponent,
  ButtonGroupContentComponent,
  ButtonGroupItemContentTemplateDirective,
];

const DIRECTIVES: Type<unknown>[] = [
  ButtonGroupComponent,
  ButtonGroupItemComponent,
  ButtonGroupContainerComponent,
  ButtonGroupContentComponent,
  ButtonGroupItemContentTemplateDirective,
];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [SharedModule, ScrollableModule],
  exports: [...COMPONENTS, ...DIRECTIVES],
})
export class ButtonGroupModule {}
