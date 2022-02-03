import { NgModule, Type } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { TabsContainerComponent } from './components/tabs-container/tabs-container.component';
import { TabsContentComponent } from './components/tabs-content/tabs-content.component';
import { TabsItemComponent } from './components/tabs-item/tabs-item.component';
import { TabsSeparatorComponent } from './components/tabs-separator/tabs-separator.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabsItemContentTemplateDirective } from './directives/tabs-item-content-template.directive';

const COMPONENTS: Type<unknown>[] = [
  TabsComponent,
  TabsItemComponent,
  TabsContainerComponent,
  TabsContentComponent,
  TabsItemContentTemplateDirective,
  TabsSeparatorComponent,
];

const DIRECTIVES: Type<unknown>[] = [
  TabsComponent,
  TabsItemComponent,
  TabsContainerComponent,
  TabsContentComponent,
  TabsItemContentTemplateDirective,
];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [SharedModule, ScrollableModule],
  exports: [...COMPONENTS, ...DIRECTIVES],
})
export class TabsModule {}
