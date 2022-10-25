import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PupaPipesModule } from '@bimeister/pupakit.common';
import {
  appChevronDownIcon,
  appChevronUpIcon,
  mAbortIcon,
  mErrorIcon,
  PupaIconsModule,
} from '@bimeister/pupakit.icons';
import {
  PupaCheckboxModule,
  PupaIconModule,
  PupaOptionModule,
  PupaTagModule,
  PupaThemeWrapperModule,
  PupaTooltipModule,
} from '@bimeister/pupakit.kit';
import { PupaTreeLayoutModule } from '@bimeister/pupakit.tree';
import { SelectDropdownFooterComponent } from './components/select-dropdown-footer/select-dropdown-footer.component';
import { SelectDropdownHeaderComponent } from './components/select-dropdown-header/select-dropdown-header.component';
import { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component';
import { SelectOptionIconComponent } from './components/select-option-icon/select-option-icon.component';
import { SelectOptionComponent } from './components/select-option/select-option.component';
import { SelectOptionsContainerComponent } from './components/select-options-container/select-options-container.component';
import { SelectTriggerExtraCaseComponent } from './components/select-trigger-extra-case/select-trigger-extra-case.component';
import { SelectTriggerInputComponent } from './components/select-trigger-input/select-trigger-input.component';
import { SelectTriggerTagComponent } from './components/select-trigger-tag/select-trigger-tag.component';
import { SelectTriggerTagsComponent } from './components/select-trigger-tags/select-trigger-tags.component';
import { SelectTriggerComponent } from './components/select-trigger/select-trigger.component';
import { SelectComponent } from './components/select/select.component';
import { PupaSelectTriggerTagTemplateDirective } from './directives/select-trigger-tag-template.directive';

const COMPONENTS: Type<unknown>[] = [
  SelectComponent,

  SelectTriggerComponent,
  SelectTriggerInputComponent,
  SelectTriggerTagsComponent,
  SelectTriggerExtraCaseComponent,
  SelectTriggerTagComponent,

  SelectOptionsContainerComponent,
  SelectOptionComponent,
  SelectOptionIconComponent,

  SelectDropdownComponent,
  SelectDropdownHeaderComponent,
  SelectDropdownFooterComponent,
];

const DIRECTIVES: Type<unknown>[] = [PupaSelectTriggerTagTemplateDirective];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS, ...DIRECTIVES];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    PupaPipesModule,
    PupaTooltipModule,
    PupaCheckboxModule,
    PupaTagModule,
    PupaThemeWrapperModule,
    PupaIconModule,
    PupaIconsModule.forFeature([appChevronDownIcon, appChevronUpIcon, mAbortIcon, mErrorIcon]),
    PupaTreeLayoutModule,
    PupaOptionModule,
  ],
  exports: [...EXPORTS],
})
export class PupaSelectModule {}
