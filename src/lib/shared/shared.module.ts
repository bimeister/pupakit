import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsNullOrUndefinedPipe } from './pipes/is-null-or-undefined.pipe';

const SHARED_COMPONENTS: any[] = [];
const SHARED_PIPES: any[] = [IsNullOrUndefinedPipe];
const SHARED_MODULES: any[] = [CommonModule, BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: [...SHARED_COMPONENTS, ...SHARED_PIPES],
  imports: [...SHARED_MODULES],
  exports: [...SHARED_MODULES, ...SHARED_COMPONENTS, ...SHARED_PIPES]
})
export class SharedModule {}
