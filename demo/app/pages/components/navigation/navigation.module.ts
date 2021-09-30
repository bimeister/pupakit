import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { DemoSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    NavbarComponent,
    ThemeToggleComponent
  ],
  exports: [NavbarComponent],
  imports: [
    DemoSharedModule,
  ]
})
export class NavigationModule { }
