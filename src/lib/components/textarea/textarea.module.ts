import { TextFieldModule } from '@angular/cdk/text-field';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { TextareaComponent } from './components/textarea/textarea.component';

@NgModule({
  declarations: [TextareaComponent],
  imports: [SharedModule, TextFieldModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TextareaComponent]
})
export class TextareaModule {}
