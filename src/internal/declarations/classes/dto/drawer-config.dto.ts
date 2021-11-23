import { Injector, StaticProvider } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { DrawerConfig } from '../../interfaces/drawer-config.interface';
import { Theme } from '../../enums/theme.enum';
import { ComponentType } from '@angular/cdk/portal';

export class DrawerConfigDto<ContainerComponent> implements DrawerConfig<ContainerComponent> {
  /** @deprecated soon it will be only 'right' */
  public float: 'left' | 'right' = 'right';
  public hasBackdrop: boolean = true;
  public closeOnBackdropClick: boolean = true;
  public isBackdropTransparent: boolean = false;
  public injector: Injector = null;
  public providers: StaticProvider[] = [];
  public containerComponent: ComponentType<ContainerComponent> | null = null;
  public theme: Theme = Theme.Light;

  constructor(config: Partial<DrawerConfig<ContainerComponent>>) {
    if (isNil(config)) {
      return;
    }
    Object.assign(this, config);
  }
}
