import { ModuleWithProviders, NgModule } from '@angular/core';
import { IconComponent } from './components/icon/icon.component';
import { IconDefinition } from '../../../internal/declarations/interfaces/icon-definition.interface';
import { AVAILABLE_ICONS_TOKEN } from '../../../internal/constants/tokens/available-icons.token';
import { IconRegistry } from '../../../internal/declarations/types/icon-registry.type';

@NgModule({
  declarations: [IconComponent],
  exports: [IconComponent]
})
export class IconModule {
  public static forRoot(icons: IconDefinition[] = []): ModuleWithProviders<IconModule> {
    return IconModule.getModuleWithProviders(icons);
  }

  public static forFeature(icons: IconDefinition[] = []): ModuleWithProviders<IconModule> {
    return IconModule.getModuleWithProviders(icons);
  }

  private static getModuleWithProviders(icons: IconDefinition[]): ModuleWithProviders<IconModule> {
    return {
      ngModule: IconModule,
      providers: [
        { provide: AVAILABLE_ICONS_TOKEN, useValue: IconModule.convertIconsArrayToRegistry(icons), multi: true }
      ]
    };
  }

  private static convertIconsArrayToRegistry(icons: IconDefinition[]): IconRegistry {
    return new Map<string, string>(icons.map((icon: IconDefinition) => [icon.name, icon.data]));
  }
}
