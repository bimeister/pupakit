import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PipesModule } from '../pipes/pipes.module';

const MODULES: any[] = [CommonModule, FormsModule, ReactiveFormsModule, PipesModule];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class SharedModule {}
