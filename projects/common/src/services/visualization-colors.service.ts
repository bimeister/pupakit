import { Injectable } from '@angular/core';
import indexConfig from '../assets/configs/index-colors-config.json';
import visualizationConfig from '../assets/configs/visualization-colors-config.json';
import { VisualizationColor } from '../declarations/classes/visualization-color.class';
import { VisualizationColorsConfig } from '../declarations/interfaces/visualization-colors-config.interface';
import { VisualizationConfiguration } from '../declarations/interfaces/visualization-configuration.interface';
import { VisualizationConfigurationGroup } from '../declarations/interfaces/visualization-configuration-group.interface';

@Injectable({ providedIn: 'root' })
export class VisualizationColorsService {
  public readonly indexConfig: VisualizationColorsConfig.Group[] = indexConfig;
  public readonly visualizationConfig: VisualizationColorsConfig.Group[] = visualizationConfig;

  public readonly indexGroups: VisualizationConfigurationGroup[] = this.getVisualizationConfigurationGroup(
    this.indexConfig,
    'index'
  );

  public readonly visualizationGroups: VisualizationConfigurationGroup[] = this.getVisualizationConfigurationGroup(
    this.visualizationConfig,
    'visualization'
  );

  private getVisualizationConfigurationGroup(
    config: VisualizationColorsConfig.Group[],
    categoryName: string
  ): VisualizationConfigurationGroup[] {
    return config.map((group: VisualizationColorsConfig.Group) => {
      const groupName: string = group.name;

      const configurationVisualizationColors: VisualizationConfiguration[] = group.configurations.map(
        (configuration: VisualizationColorsConfig.Configuration) => ({
          name: configuration.name,
          color: new VisualizationColor(configuration, groupName, categoryName),
        })
      );

      return {
        name: group.name,
        configurations: configurationVisualizationColors,
      };
    });
  }
}
