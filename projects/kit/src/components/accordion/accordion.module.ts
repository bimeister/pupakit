import { NgModule, Type } from '@angular/core';
import { PupaCommonModule } from '@bimeister/pupakit.common';
import { PupaAccordionActionTemplateDirective } from './directives/accordion-action-template.directive';
import { AccordionComponent } from './components/accordion/accordion.component';
import { AccordionHeaderComponent } from './components/accordion-header/accordion-header.component';
import { AccordionDescriptionComponent } from './components/accordion-description/accordion-description.component';
import { AccordionTitleComponent } from './components/accordion-title/accordion-title.component';
import { AccordionBodyComponent } from './components/accordion-body/accordion-body.component';
import { AccordionGroupComponent } from './components/accordion-group/accordion-group.component';
import { CommonModule } from '@angular/common';
import { appArrowFullBotIcon, appArrowFullTopIcon, PupaIconsModule } from '@bimeister/pupakit.icons';

const COMPONENTS: Type<unknown>[] = [
  AccordionComponent,
  AccordionHeaderComponent,
  AccordionTitleComponent,
  AccordionDescriptionComponent,
  AccordionBodyComponent,
  AccordionGroupComponent,
];

const DIRECTIVES: Type<unknown>[] = [PupaAccordionActionTemplateDirective];

@NgModule({
  declarations: [COMPONENTS, DIRECTIVES],
  imports: [CommonModule, PupaCommonModule, PupaIconsModule.forFeature([appArrowFullTopIcon, appArrowFullBotIcon])],
  exports: [COMPONENTS, DIRECTIVES],
})
export class PupaAccordionModule {}
