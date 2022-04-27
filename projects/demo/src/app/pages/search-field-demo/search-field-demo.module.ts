import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SearchFieldDemoExampleBasicComponent } from './examples/search-field-demo-example-basic/search-field-demo-example-basic.component';
import { SearchFieldDemoExampleCollapsibleComponent } from './examples/search-field-demo-example-collapsible/search-field-demo-example-collapsible.component';
import { SearchFieldDemoRoutingModule } from './search-field-demo-routing.module';
import { SearchFieldDemoComponent } from './search-field-demo.component';

@NgModule({
  declarations: [
    SearchFieldDemoComponent,
    SearchFieldDemoExampleBasicComponent,
    SearchFieldDemoExampleCollapsibleComponent,
  ],
  imports: [DemoSharedModule, SearchFieldDemoRoutingModule],
})
export class SearchFieldDemoModule {}
