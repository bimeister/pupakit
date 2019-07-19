import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { PupakitCore } from '../../src/lib/core/pupakit-core.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LoaderDemoComponent } from './loader-demo/loader-demo.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { CheckboxDemoComponent } from './checkbox-demo/checkbox-demo.component';
import { ButtonDemoComponent } from './button-demo/button-demo.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, LoaderDemoComponent, InputDemoComponent, CheckboxDemoComponent, ButtonDemoComponent],
  imports: [BrowserModule, PupakitCore, FormsModule, ReactiveFormsModule, RouterModule.forRoot([
    {
      path: 'loader',
      component: LoaderDemoComponent
    },
    {
      path: 'button',
      component: ButtonDemoComponent
    },
    {
      path: 'checkbox',
      component: CheckboxDemoComponent
    },
    {
      path: 'input',
      component: InputDemoComponent
    },
    {
      path: '',
      component: AppComponent
    }
  ])],
  providers: []
})
export class AppModule {}
