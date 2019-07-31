import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ControlTextComponent } from './components/control-text/control-text.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { InputComponent } from './components/input/input.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { SelectComponent } from './components/select/select.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TileComponent } from './components/tile/tile.component';
import { SwitcherComponent } from './components/switcher/switcher.component';
import { DroppableComponent } from './components/droppable/droppable.component';
import { RatingComponent } from './components/rating/rating.component';
import { DaySelectorComponent } from './components/day-selector/day-selector.component';

const CORE_COMPONENTS: any[] = [
  ButtonComponent,
  InputComponent,
  CheckboxComponent,
  SpinnerComponent,
  TileComponent,
  ControlTextComponent,
  LoaderComponent,
  DropdownComponent,
  SelectComponent,
  IconButtonComponent,
  SearchFieldComponent,
  SwitcherComponent,
  DroppableComponent,
  RatingComponent,
  DaySelectorComponent
];

@NgModule({
  imports: [SharedModule],
  declarations: [...CORE_COMPONENTS],
  exports: [SharedModule, ...CORE_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PupakitCore {}
