import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PupaTabsModule } from '@bimeister/pupakit.kit';
import { PageComponent } from './components/page/page.component';
import { PageTabDirective } from './directives/page-tab.directive';

const EXPORTS: Type<unknown>[] = [PageComponent, PageTabDirective];
const IMPORTS: Type<unknown>[] = [CommonModule, RouterModule, PupaTabsModule];

@NgModule({
  declarations: EXPORTS,
  imports: IMPORTS,
  exports: EXPORTS,
})
export class PageModule {}
