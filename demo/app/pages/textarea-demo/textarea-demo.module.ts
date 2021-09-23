import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TextareaDemoRoutingModule } from './textarea-demo-routing.module';
import { TextareaDemoComponent } from './textarea-demo.component';

@NgModule({
  declarations: [TextareaDemoComponent],
  imports: [DemoSharedModule, TextareaDemoRoutingModule]
})
export class TextareaDemoModule {}
