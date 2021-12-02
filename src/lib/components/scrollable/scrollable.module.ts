import { NgModule } from '@angular/core';
import { ScrollableComponent } from './components/scrollable/scrollable.component';
import { CommonModule } from '@angular/common';
import { ScrollableContentDirective } from './directives/scrollable-content.directive';

@NgModule({
  declarations: [ScrollableComponent, ScrollableContentDirective],
  imports: [CommonModule],
  exports: [ScrollableComponent, ScrollableContentDirective],
})
export class ScrollableModule {}
