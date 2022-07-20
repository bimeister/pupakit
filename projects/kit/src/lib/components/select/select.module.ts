import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule, Type } from '@angular/core';
import { appChevronDownIcon } from '../../../internal/constants/icons/app-chevron-down-icon.const';
import { appCrossCircleIcon } from '../../../internal/constants/icons/app-cross-circle-icon.const';
import { appInfoIcon } from '../../../internal/constants/icons/app-info-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ButtonModule } from '../button/button.module';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { IconModule } from '../icon/icon.module';
import { TagModule } from '../tag/tag.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { SelectDropdownFooterComponent } from './components/select-dropdown-footer/select-dropdown-footer.component';
import { SelectDropdownHeaderComponent } from './components/select-dropdown-header/select-dropdown-header.component';
import { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component';
import { SelectOptionCheckboxComponent } from './components/select-option-checkbox/select-option-checkbox.component';
import { SelectOptionIconComponent } from './components/select-option-icon/select-option-icon.component';
import { SelectOptionComponent } from './components/select-option/select-option.component';
import { SelectOptionsContainerComponent } from './components/select-options-container/select-options-container.component';
import { SelectTriggerExtraCaseComponent } from './components/select-trigger-extra-case/select-trigger-extra-case.component';
import { SelectTriggerInputComponent } from './components/select-trigger-input/select-trigger-input.component';
import { SelectTriggerTagsComponent } from './components/select-trigger-tags/select-trigger-tags.component';
import { SelectTriggerComponent } from './components/select-trigger/select-trigger.component';
import { SelectComponent } from './components/select/select.component';
import { PupaSelectTriggerTagTemplateDirective } from './directives/select-trigger-tag-template.directive';
import { TreeLayoutModule } from '../tree-layout/tree-layout.module';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { SelectTriggerTagComponent } from './components/select-trigger-tag/select-trigger-tag.component';

const COMPONENTS: Type<unknown>[] = [
  SelectComponent,

  SelectTriggerComponent,
  SelectTriggerInputComponent,
  SelectTriggerTagsComponent,
  SelectTriggerExtraCaseComponent,
  SelectTriggerTagComponent,

  SelectOptionsContainerComponent,
  SelectOptionComponent,
  SelectOptionCheckboxComponent,
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
    SharedModule,
    OverlayModule,
    TooltipModule,
    CheckboxModule,
    TagModule,
    ThemeWrapperModule,
    ButtonModule,
    IconModule.forFeature([appChevronDownIcon, appCrossCircleIcon, appInfoIcon]),
    TreeLayoutModule,
  ],
  exports: [...EXPORTS],
})
export class SelectModule {}
