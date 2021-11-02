import { NgModule, Type } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabsItemComponent } from './components/tabs-item/tabs-item.component';
import { TabsContainerComponent } from './components/tabs-container/tabs-container.component';
import { TabsContentComponent } from './components/tabs-content/tabs-content.component';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { TabsItemContentTemplateDirective } from './directives/tabs-item-content-template.directive';
import { TabsSeparatorComponent } from './components/tabs-separator/tabs-separator.component';

const COMPONENTS: Type<unknown>[] = [
  TabsComponent,
  TabsItemComponent,
  TabsContainerComponent,
  TabsContentComponent,
  TabsItemContentTemplateDirective,
  TabsSeparatorComponent
];

const DIRECTIVES: Type<unknown>[] = [
  TabsComponent,
  TabsItemComponent,
  TabsContainerComponent,
  TabsContentComponent,
  TabsItemContentTemplateDirective
];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [SharedModule, ScrollableModule],
  exports: [...COMPONENTS, ...DIRECTIVES]
})
export class TabsModule {}
