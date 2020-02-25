import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableComponent } from './components/draggable/draggable.component';
import { DraggerComponent } from './components/dragger/dragger.component';



@NgModule({
  declarations: [DraggableComponent, DraggerComponent],
  imports: [
    CommonModule
  ]
})
export class DraggableModule { }
