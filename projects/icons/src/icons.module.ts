import { ModuleWithProviders, NgModule } from '@angular/core';
import { IconDefinition } from './declarations/interfaces/icon-definition.interface';
import { AVAILABLE_ICONS_TOKEN } from './declarations/tokens/available-icons.token';
import { IconRegistry } from './declarations/types/icon-registry.type';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class PupaIconsModule {
  public static forRoot(icons: IconDefinition[] = []): ModuleWithProviders<PupaIconsModule> {
    const moduleWithIcons: ModuleWithProviders<PupaIconsModule> = PupaIconsModule.getModuleWithProviders(icons);
    return moduleWithIcons;
  }

  public static forFeature(icons: IconDefinition[] = []): ModuleWithProviders<PupaIconsModule> {
    const moduleWithIcons: ModuleWithProviders<PupaIconsModule> = PupaIconsModule.getModuleWithProviders(icons);
    return moduleWithIcons;
  }

  private static getModuleWithProviders(icons: IconDefinition[]): ModuleWithProviders<PupaIconsModule> {
    const iconsRegistryEntries: [string, string][] = icons.map((icon: IconDefinition) => [icon.name, icon.data]);
    const filledIconsRegistry: IconRegistry = new Map<string, string>(iconsRegistryEntries);

    return {
      ngModule: PupaIconsModule,
      providers: [{ provide: AVAILABLE_ICONS_TOKEN, useValue: filledIconsRegistry, multi: true }],
    };
  }
}
