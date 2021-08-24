import { NgModule, Type } from '@angular/core';
import { AdaptiveDemoRoutingModule } from './adaptive-demo-routing.module';
import { AdaptiveDemoComponent } from './adaptive-demo.component';

const COMPONENTS: Type<unknown>[] = [AdaptiveDemoComponent];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [AdaptiveDemoRoutingModule]
})
export class AdaptiveDemoModule {}
