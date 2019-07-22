import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LoaderDemoComponent } from './loader-demo/loader-demo.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { CheckboxDemoComponent } from './checkbox-demo/checkbox-demo.component';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { DropdownDemoComponent } from './dropdown-demo/dropdown-demo.component';
import { PupakitCore } from '../../src/lib/core/pupakit-core.module';
import { TileDemoComponent } from './tile-demo/tile-demo.component';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LoaderDemoComponent,
    InputDemoComponent,
    CheckboxDemoComponent,
    ButtonDemoComponent,
    DropdownDemoComponent,
    TileDemoComponent
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, PupakitCore, RouterModule.forRoot(
    [
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
        path: 'dropdown',
        component: DropdownDemoComponent
      },
      {
        path: 'tile',
        component: TileDemoComponent,
      },
      {
        path: '',
        component: AppComponent
      }
    ]
  )],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
