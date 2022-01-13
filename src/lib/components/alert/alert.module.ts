import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import { appExceptionsCross10Icon } from '../../../internal/constants/icons/app-exceptions-cross-10-icon.const';
import { ALERT_MODULE_CONFIG_TOKEN } from '../../../internal/constants/tokens/alert-module-config.token';
import { AlertModuleConfig } from '../../../internal/declarations/interfaces/alert-module-config.interface';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { AlertLayoutBodyComponent } from './components/alert-layout-body/alert-layout-body.component';
import { AlertLayoutCloseButtonComponent } from './components/alert-layout-close-button/alert-layout-close-button.component';
import { AlertLayoutFooterComponent } from './components/alert-layout-footer/alert-layout-footer.component';
import { AlertLayoutHeaderComponent } from './components/alert-layout-header/alert-layout-header.component';
import { AlertLayoutComponent } from './components/alert-layout/alert-layout.component';
import { AlertTemplateComponent } from './components/alert-template/alert-template.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertsContainerComponent } from './components/alerts-container/alerts-container.component';

const DECLARATIONS: Type<unknown>[] = [AlertsContainerComponent];

const EXPORTS: Type<unknown>[] = [
  AlertComponent,
  AlertTemplateComponent,
  AlertLayoutComponent,
  AlertLayoutHeaderComponent,
  AlertLayoutBodyComponent,
  AlertLayoutFooterComponent,
  AlertLayoutCloseButtonComponent,
];

@NgModule({
  declarations: [...DECLARATIONS, ...EXPORTS],
  exports: EXPORTS,
  imports: [
    CommonModule,
    ButtonModule,
    ScrollableModule,
    PortalModule,
    ThemeWrapperModule,
    IconModule.forFeature([appExceptionsCross10Icon]),
  ],
})
export class AlertModule {
  public static forRoot(config: AlertModuleConfig): ModuleWithProviders<AlertModule> {
    return {
      ngModule: AlertModule,
      providers: [
        {
          provide: ALERT_MODULE_CONFIG_TOKEN,
          useValue: config,
        },
      ],
    };
  }
}
