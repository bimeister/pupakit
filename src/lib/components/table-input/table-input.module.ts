import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from './../../../internal/shared/shared.module';
import { TableInputComponent } from './components/table-input/table-input.component';

@NgModule({
  declarations: [TableInputComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TableInputComponent]
})
export class TableInputModule {}
