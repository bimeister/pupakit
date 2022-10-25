import { NgModule, Type } from '@angular/core';
import { AccordionComponent } from './components/accordion/accordion.component';
import { AccordionHeaderComponent } from './components/accordion-header/accordion-header.component';
import { AccordionDescriptionComponent } from './components/accordion-description/accordion-description.component';
import { AccordionTitleComponent } from './components/accordion-title/accordion-title.component';
import { AccordionBodyComponent } from './components/accordion-body/accordion-body.component';
import { AccordionGroupComponent } from './components/accordion-group/accordion-group.component';
import { CommonModule } from '@angular/common';
import { PupaIconModule } from '../icon/icon.module';

const COMPONENTS: Type<unknown>[] = [
  AccordionComponent,
  AccordionHeaderComponent,
  AccordionTitleComponent,
  AccordionDescriptionComponent,
  AccordionBodyComponent,
  AccordionGroupComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, PupaIconModule],
  exports: [...COMPONENTS],
})
export class PupaAccordionModule {}
