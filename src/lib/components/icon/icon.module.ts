import { ModuleWithProviders, NgModule } from '@angular/core';
import { AVAILABLE_ICONS_TOKEN } from '../../../internal/constants/tokens/available-icons.token';
import { IconDefinition } from '../../../internal/declarations/interfaces/icon-definition.interface';
import { IconRegistry } from '../../../internal/declarations/types/icon-registry.type';
import { IconComponent } from './components/icon/icon.component';

/** @dynamic */
@NgModule({
  declarations: [IconComponent],
  exports: [IconComponent]
})
export class IconModule {
  public static forRoot(icons: IconDefinition[] = []): ModuleWithProviders<IconModule> {
    const moduleWithIcons: ModuleWithProviders<IconModule> = IconModule.getModuleWithProviders(icons);
    return moduleWithIcons;
  }

  public static forFeature(icons: IconDefinition[] = []): ModuleWithProviders<IconModule> {
    const moduleWithIcons: ModuleWithProviders<IconModule> = IconModule.getModuleWithProviders(icons);
    return moduleWithIcons;
  }

  private static getModuleWithProviders(icons: IconDefinition[]): ModuleWithProviders<IconModule> {
    const iconsRegistryEntries: [string, string][] = icons.map((icon: IconDefinition) => [icon.name, icon.data]);
    const filledIconsRegistry: IconRegistry = new Map<string, string>(iconsRegistryEntries);

    return {
      ngModule: IconModule,
      providers: [{ provide: AVAILABLE_ICONS_TOKEN, useValue: filledIconsRegistry, multi: true }]
    };
  }
}
