import { ComponentType } from '@angular/cdk/portal';

export interface AlertModuleConfig {
  readonly toolbarComponent: ComponentType<unknown> | null;
}
