import { Injectable } from '@angular/core';
import config from '../../../assets/configs/semantic-colors-config.json';
import { SemanticColor } from '../../../internal/declarations/classes/semantic-color.class';
import { SemanticColorsConfig } from '../../../internal/declarations/interfaces/semantic-colors-config.interface';
import { SemanticConfigurationGroup } from '../../../internal/declarations/interfaces/semantic-configuration-group.interface';
import { SemanticConfiguration } from '../../../internal/declarations/interfaces/semantic-configuration.interface';

@Injectable({ providedIn: 'root' })
export class SemanticColorsService {
  public readonly config: SemanticColorsConfig.Group[] = config;

  public readonly groups: SemanticConfigurationGroup[] = this.config.map((group: SemanticColorsConfig.Group) => {
    const groupName: string = group.name;

    const configurationSemanticColors: SemanticConfiguration[] = group.configurations.map(
      (configuration: SemanticColorsConfig.Configuration) => ({
        name: configuration.name,
        color: new SemanticColor(configuration, groupName),
      })
    );

    return {
      name: group.name,
      configurations: configurationSemanticColors,
    };
  });
}
