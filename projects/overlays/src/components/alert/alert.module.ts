import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { appExceptionsCross10Icon, PupaIconsModule } from '@bimeister/pupakit.icons';
import {
  PupaButtonsModule,
  PupaIconModule,
  PupaScrollableModule,
  PupaThemeWrapperModule,
} from '@bimeister/pupakit.kit';
import { ALERT_MODULE_CONFIG_TOKEN } from '../../declarations/tokens/alert-module-config.token';
import { AlertModuleConfig } from '../../declarations/interfaces/alert-module-config.interface';
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
    PupaButtonsModule,
    PupaScrollableModule,
    PortalModule,
    PupaThemeWrapperModule,
    PupaIconModule,
    PupaIconsModule.forFeature([appExceptionsCross10Icon]),
  ],
})
export class PupaAlertModule {
  public static forRoot(config: AlertModuleConfig): ModuleWithProviders<PupaAlertModule> {
    return {
      ngModule: PupaAlertModule,
      providers: [
        {
          provide: ALERT_MODULE_CONFIG_TOKEN,
          useValue: config,
        },
      ],
    };
  }
}
