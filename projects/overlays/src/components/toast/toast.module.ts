import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { PupaLinkModule, PupaThemeWrapperModule, PupaTimerModule } from '@bimeister/pupakit.kit';

import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { ToastLayoutComponent } from './components/toast-layout/toast-layout.component';
import { ToastTemplateComponent } from './components/toast-template/toast-template.component';
import { ToastComponent } from './components/toast/toast.component';

const DECLARATIONS: Type<unknown>[] = [ToastContainerComponent];

const EXPORTS: Type<unknown>[] = [ToastComponent, ToastTemplateComponent, ToastLayoutComponent];

@NgModule({
  declarations: [...DECLARATIONS, ...EXPORTS],
  imports: [CommonModule, PupaThemeWrapperModule, PupaLinkModule, PortalModule, PupaTimerModule],
  exports: EXPORTS,
})
export class PupaToastModule {}
