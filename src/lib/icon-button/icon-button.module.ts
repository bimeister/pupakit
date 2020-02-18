import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AngularComponent } from './../../internal';
import { IconButtonComponent } from './components';

const COMPONENTS: AngularComponent[] = [IconButtonComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule],
  exports: [...COMPONENTS]
})
export class IconButtonModule {}
