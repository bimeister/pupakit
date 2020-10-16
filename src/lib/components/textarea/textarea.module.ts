import { TextFieldModule } from '@angular/cdk/text-field';
import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { TextareaComponent } from './components/textarea/textarea.component';

@NgModule({
  declarations: [TextareaComponent],
  imports: [SharedModule, TextFieldModule],
  exports: [TextareaComponent]
})
export class TextareaModule {}
