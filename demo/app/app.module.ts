import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { PupakitCore } from '../../src/lib/core/pupakit-core.module';
import { AppComponent } from './app.component';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { CheckboxDemoComponent } from './checkbox-demo/checkbox-demo.component';
import { DropdownDemoComponent } from './dropdown-demo/dropdown-demo.component';
import { IconButtonDemoComponent } from './icon-button-demo/icon-button-demo.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { LoaderDemoComponent } from './loader-demo/loader-demo.component';
import { SearchFieldDemoComponent } from './search-field-demo/search-field-demo.component';
import { SelectDemoComponent } from './select-demo/select-demo.component';
import { SpinnerDemoComponent } from './spinner-demo/spinner-demo.component';
import { TileDemoComponent } from './tile-demo/tile-demo.component';
import { SwitcherDemoComponent } from './switcher-demo/switcher-demo.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LoaderDemoComponent,
    InputDemoComponent,
    CheckboxDemoComponent,
    ButtonDemoComponent,
    DropdownDemoComponent,
    TileDemoComponent,
    SpinnerDemoComponent,
    SelectDemoComponent,
    IconButtonDemoComponent,
    SearchFieldDemoComponent,
    SwitcherDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PupakitCore,
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/loader'
      },
      {
        path: 'spinner',
        component: SpinnerDemoComponent
      },
      {
        path: 'loader',
        component: LoaderDemoComponent
      },
      {
        path: 'button',
        component: ButtonDemoComponent
      },
      {
        path: 'icon-button',
        component: IconButtonDemoComponent
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
        path: 'search-field',
        component: SearchFieldDemoComponent
      },
      {
        path: 'dropdown',
        component: DropdownDemoComponent
      },
      {
        path: 'tile',
        component: TileDemoComponent
      },
      {
        path: 'select',
        component: SelectDemoComponent
      },
      {
        path: 'switcher',
        component: SwitcherDemoComponent
      }
    ])
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
