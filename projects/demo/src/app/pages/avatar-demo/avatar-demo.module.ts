import { NgModule } from '@angular/core';

import { DemoSharedModule } from '../../shared/shared.module';
import { AvatarDemoRoutingModule } from './avatar-demo-routing.module';
import { AvatarDemoComponent } from './avatar-demo.component';

import { AvatarExample1Component } from './examples/example-1/example-1.component';
import { AvatarExample2Component } from './examples/example-2/example-2.component';
import { AvatarExample3Component } from './examples/example-3/example-3.component';
import { AvatarExample4Component } from './examples/example-4/example-4.component';
import { AvatarExample5Component } from './examples/example-5/example-5.component';
import { AvatarExample6Component } from './examples/example-6/example-6.component';

@NgModule({
  declarations: [
    AvatarDemoComponent,
    AvatarExample1Component,
    AvatarExample2Component,
    AvatarExample3Component,
    AvatarExample4Component,
    AvatarExample5Component,
    AvatarExample6Component,
  ],
  imports: [DemoSharedModule, AvatarDemoRoutingModule],
})
export class AvatarDemoModule {}
