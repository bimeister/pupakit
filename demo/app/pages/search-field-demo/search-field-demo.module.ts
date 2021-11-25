import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SearchFieldExample1Component } from './examples/example-1/example-1.component';
import { SearchFieldDemoRoutingModule } from './search-field-demo-routing.module';
import { SearchFieldDemoComponent } from './search-field-demo.component';

@NgModule({
  declarations: [SearchFieldDemoComponent, SearchFieldExample1Component],
  imports: [DemoSharedModule, SearchFieldDemoRoutingModule]
})
export class SearchFieldDemoModule {}
