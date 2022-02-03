import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { LinkModule } from '../link/link.module';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { TimerModule } from '../timer/timer.module';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { ToastLayoutComponent } from './components/toast-layout/toast-layout.component';
import { ToastTemplateComponent } from './components/toast-template/toast-template.component';
import { ToastComponent } from './components/toast/toast.component';

const DECLARATIONS: Type<unknown>[] = [ToastContainerComponent];

const EXPORTS: Type<unknown>[] = [ToastComponent, ToastTemplateComponent, ToastLayoutComponent];

@NgModule({
  declarations: [...DECLARATIONS, ...EXPORTS],
  imports: [CommonModule, ThemeWrapperModule, LinkModule, PortalModule, TimerModule],
  exports: EXPORTS,
})
export class ToastModule {}
