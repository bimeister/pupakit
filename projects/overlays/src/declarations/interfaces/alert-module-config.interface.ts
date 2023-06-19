import { ComponentType } from '@angular/cdk/portal';
import { ThemeBehavior } from '../enums/theme-behavior.enum';

export interface AlertModuleConfig {
  readonly toolbarComponent: ComponentType<unknown> | null;
  readonly themeBehaviour?: ThemeBehavior;
}
