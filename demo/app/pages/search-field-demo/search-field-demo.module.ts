import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SearchFieldDemoRoutingModule } from './search-field-demo-routing.module';
import { SearchFieldDemoComponent } from './search-field-demo.component';

@NgModule({
  declarations: [SearchFieldDemoComponent],
  imports: [DemoSharedModule, SearchFieldDemoRoutingModule]
})
export class SearchFieldDemoModule {}
