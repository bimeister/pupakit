import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SearchFieldDemoExampleBasicComponent } from './examples/search-field-demo-example-basic/search-field-demo-example-basic.component';
import { SearchFieldDemoExampleCollapsibleComponent } from './examples/search-field-demo-example-collapsible/search-field-demo-example-collapsible.component';
import { SearchFieldDemoRoutingModule } from './search-field-demo-routing.module';
import { SearchFieldDemoComponent } from './search-field-demo.component';
import { SearchFieldDemoExampleActionComponent } from './examples/search-field-demo-example-action/search-field-demo-example-action.component';
import { PupaButtonsModule } from '@bimeister/pupakit.kit';

@NgModule({
  declarations: [
    SearchFieldDemoComponent,
    SearchFieldDemoExampleBasicComponent,
    SearchFieldDemoExampleCollapsibleComponent,
    SearchFieldDemoExampleActionComponent,
  ],
  imports: [DemoSharedModule, SearchFieldDemoRoutingModule, PupaButtonsModule],
})
export class SearchFieldDemoModule {}
